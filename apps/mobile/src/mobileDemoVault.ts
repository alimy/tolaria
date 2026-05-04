import { demoNoteSources } from './demoData'
import { createMobileVaultConfig } from './mobileVaultConfig'
import { createNativeMobileVaultStorage } from './mobileNativeVaultStorage'
import { createStoredMobileVaultRepository } from './mobileVaultRepository'
import { seedMobileVaultIfEmpty } from './mobileVaultSeed'
import type { MobileVaultFile } from './mobileVaultStorage'

const demoVault = createDemoVaultConfig()

export async function loadDemoVaultNotes() {
  const storage = createNativeMobileVaultStorage()
  await seedMobileVaultIfEmpty({ files: demoVaultFiles(), storage, vault: demoVault })

  return createStoredMobileVaultRepository({ storage, vault: demoVault }).listNotes()
}

function demoVaultFiles(): MobileVaultFile[] {
  return demoNoteSources.map((source) => ({
    path: source.filename,
    content: source.content,
  }))
}

function createDemoVaultConfig() {
  const result = createMobileVaultConfig({ id: 'personal', name: 'Personal Journal' })
  if (!result.ok) {
    throw new Error(result.error)
  }

  return result.config
}
