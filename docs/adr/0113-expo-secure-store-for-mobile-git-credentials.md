# ADR-0113: Expo SecureStore for Mobile Git Credentials

Date: 2026-05-05

## Status

Accepted

## Context

Tolaria mobile will sync app-managed vaults through Git. Remote-backed vaults need credentials before clone, pull, push, and AutoGit-style checkpointing can work.

The first supported GitHub path is a GitHub OAuth App over HTTPS. Arbitrary remotes will later need SSH key references or provider-specific token flows. These credential signals must not live in regular app state JSON, note frontmatter, vault metadata, or Git-tracked files.

Expo SDK 55 includes `expo-secure-store`, which stores values in iOS Keychain and Android secure storage. It works in managed Expo development builds and keeps the credential boundary compatible with the later Android port.

## Decision

Use `expo-secure-store` for the mobile Git credential storage boundary.

The initial committed boundary stores credential presence records by host and auth strategy. It does not implement GitHub OAuth yet and does not store real tokens in tests. The storage contract exposes only:

- load credential state for a vault auth requirement
- save a credential record
- remove a credential record

The sync planner consumes `available` / `missing` credential state, not raw tokens or SSH material. Future GitHub OAuth and SSH implementations must keep provider-specific secret material behind this secure storage boundary and pass credentials to the native Git adapter only through narrow callback APIs.

## Consequences

- Git sync UI can distinguish local-only vaults from remote vaults that need authentication.
- Future OAuth tokens and SSH key references have a platform-secure storage home from the start.
- Native runtime builds must include the `expo-secure-store` config plugin, so adding this dependency is a native-runtime change, not an OTA-only change.
- Unit tests use a memory secure-store implementation and never depend on iOS Keychain or Android secure storage.
- The later Android port can keep the same credential contract while adapting provider flows and permissions around it.
