import { describe, expect, it, vi } from 'vitest'
import {
  loadMobileGitNativeModule,
  mobileGitNativeModuleName,
  type MobileGitNativeModuleLoader,
} from './mobileNativeGitModule'
import type { MobileGitNativeModule } from './mobileNativeGitTransport'

describe('loadMobileGitNativeModule', () => {
  it('loads the Tolaria Git native module when both operations exist', () => {
    const nativeModule: MobileGitNativeModule = {
      pull: vi.fn(),
      push: vi.fn(),
    }
    const loadModule = nativeModuleLoader(nativeModule)

    expect(loadMobileGitNativeModule({ loadModule })).toBe(nativeModule)
  })

  it('returns null when the native module is missing or incomplete', () => {
    expect(loadMobileGitNativeModule({ loadModule: () => null })).toBeNull()
    expect(loadMobileGitNativeModule({ loadModule: nativeModuleLoader({ pull: vi.fn() }) })).toBeNull()
  })
})

function nativeModuleLoader(module: unknown): MobileGitNativeModuleLoader {
  return <ModuleType,>(moduleName: string) =>
    moduleName === mobileGitNativeModuleName ? module as ModuleType : null
}
