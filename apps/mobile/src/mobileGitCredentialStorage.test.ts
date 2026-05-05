import { describe, expect, it } from 'vitest'
import {
  createMobileGitCredentialKey,
  createMobileGitCredentialRecord,
  mobileGitCredentialState,
  parseMobileGitCredentialRecord,
  serializeMobileGitCredentialRecord,
} from './mobileGitCredentialStorage'
import type { MobileVaultAuthRequirement } from './mobileVaultConfig'

describe('mobile Git credential storage model', () => {
  it('creates stable host-normalized secure storage keys', () => {
    expect(createMobileGitCredentialKey(githubRequirement(' GitHub.COM '))).toBe(
      'tolaria:git-credential:githubOAuth:github.com',
    )
  })

  it('creates a credential presence record for the required auth strategy', () => {
    expect(createMobileGitCredentialRecord({
      requirement: githubRequirement('github.com'),
      storedAt: '2026-05-05T11:00:00.000Z',
    })).toEqual({
      host: 'github.com',
      kind: 'githubOAuthToken',
      strategy: 'githubOAuth',
      storedAt: '2026-05-05T11:00:00.000Z',
    })

    expect(createMobileGitCredentialRecord({
      requirement: sshRequirement('git.example.com'),
      storedAt: '2026-05-05T11:00:00.000Z',
    })).toMatchObject({
      kind: 'sshKeyReference',
      strategy: 'sshKey',
    })
  })

  it('loads available state only when the record matches the required host and strategy', () => {
    const record = createMobileGitCredentialRecord({
      requirement: githubRequirement('github.com'),
      storedAt: '2026-05-05T11:00:00.000Z',
    })

    expect(mobileGitCredentialState({
      record,
      requirement: githubRequirement('github.com'),
    })).toEqual({ state: 'available' })

    expect(mobileGitCredentialState({
      record,
      requirement: sshRequirement('github.com'),
    })).toEqual({ state: 'missing' })
  })

  it('parses stored records defensively', () => {
    const record = createMobileGitCredentialRecord({
      requirement: githubRequirement('github.com'),
      storedAt: '2026-05-05T11:00:00.000Z',
    })

    expect(parseMobileGitCredentialRecord(serializeMobileGitCredentialRecord(record))).toEqual(record)
    expect(parseMobileGitCredentialRecord('{')).toBeNull()
    expect(parseMobileGitCredentialRecord(JSON.stringify({ host: 'github.com' }))).toBeNull()
  })
})

function githubRequirement(host: string): MobileVaultAuthRequirement {
  return { host, strategy: 'githubOAuth' }
}

function sshRequirement(host: string): MobileVaultAuthRequirement {
  return { host, strategy: 'sshKey' }
}
