import * as SecureStore from 'expo-secure-store'
import { createMobileSecureGitCredentialStorage } from './mobileSecureGitCredentialStorage'

export function createNativeMobileGitCredentialStorage() {
  return createMobileSecureGitCredentialStorage(SecureStore)
}
