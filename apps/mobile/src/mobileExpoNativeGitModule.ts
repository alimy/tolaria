import { requireOptionalNativeModule } from 'expo-modules-core'
import { loadMobileGitNativeModule } from './mobileNativeGitModule'

export function loadExpoMobileGitNativeModule() {
  return loadMobileGitNativeModule({ loadModule: requireOptionalNativeModule })
}
