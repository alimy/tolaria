import type { MobileVaultConfig } from './mobileVaultConfig'
import type { MobileVaultFile, MobileVaultStorageDriver } from './mobileVaultStorage'

export type MobileVaultSeedResult = 'alreadySeeded' | 'seeded'

export async function seedMobileVaultIfEmpty({
  files,
  storage,
  vault,
}: {
  files: MobileVaultFile[]
  storage: MobileVaultStorageDriver
  vault: MobileVaultConfig
}): Promise<MobileVaultSeedResult> {
  const existingFiles = await storage.listMarkdownFiles(vault)
  if (existingFiles.length > 0) {
    return 'alreadySeeded'
  }

  await Promise.all(files.map((file) => storage.writeMarkdownFile(vault, file.path, file.content)))

  return 'seeded'
}
