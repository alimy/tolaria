import { describe, expect, it } from 'vitest'
import { createMobileVaultConfig } from './mobileVaultConfig'
import { seedMobileVaultIfEmpty } from './mobileVaultSeed'
import { createMemoryMobileVaultStorage } from './mobileVaultStorage'

const vault = createVault()

describe('mobile vault seed', () => {
  it('writes starter notes when the mobile vault is empty', async () => {
    const storage = createMemoryMobileVaultStorage([])

    await expect(
      seedMobileVaultIfEmpty({
        files: [{ path: 'welcome.md', content: '# Welcome' }],
        storage,
        vault,
      }),
    ).resolves.toBe('seeded')

    await expect(storage.readMarkdownFile(vault, 'welcome.md')).resolves.toBe('# Welcome')
  })

  it('keeps existing mobile vault files intact', async () => {
    const storage = createMemoryMobileVaultStorage([{ path: 'existing.md', content: '# Existing' }])

    await expect(
      seedMobileVaultIfEmpty({
        files: [{ path: 'existing.md', content: '# Replacement' }],
        storage,
        vault,
      }),
    ).resolves.toBe('alreadySeeded')

    await expect(storage.readMarkdownFile(vault, 'existing.md')).resolves.toBe('# Existing')
  })
})

function createVault() {
  const result = createMobileVaultConfig({ id: 'personal', name: 'Personal Journal' })
  if (!result.ok) {
    throw new Error(result.error)
  }

  return result.config
}
