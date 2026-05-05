import type { MobileGitNativeModule } from './mobileNativeGitTransport'

export const mobileGitNativeModuleName = 'TolariaGit'

export type MobileGitNativeModuleLoader = <ModuleType>(
  moduleName: string
) => ModuleType | null

export function loadMobileGitNativeModule({
  loadModule,
}: {
  loadModule: MobileGitNativeModuleLoader
}) {
  return asMobileGitNativeModule(
    loadModule<Partial<MobileGitNativeModule>>(mobileGitNativeModuleName),
  )
}

function asMobileGitNativeModule(module: Partial<MobileGitNativeModule> | null) {
  return hasNativeGitOperation({ module, operation: 'pull' })
    && hasNativeGitOperation({ module, operation: 'push' })
    ? module as MobileGitNativeModule
    : null
}

function hasNativeGitOperation({
  module,
  operation,
}: {
  module: Partial<MobileGitNativeModule> | null
  operation: keyof MobileGitNativeModule
}) {
  return typeof module?.[operation] === 'function'
}
