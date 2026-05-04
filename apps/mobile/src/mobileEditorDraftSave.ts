import type { MobileEditorDraft } from './mobileEditorDraft'
import type { MobileVaultConfig } from './mobileVaultConfig'
import type { MobileVaultStorageDriver } from './mobileVaultStorage'

export type MobileEditorDraftSaveResult =
  | {
      status: 'saved'
      path: string
    }
  | {
      status: 'blocked'
      reason: 'unsupportedEditorHtml'
    }

export async function saveMobileEditorDraft({
  draft,
  storage,
  vault,
}: {
  draft: MobileEditorDraft
  storage: MobileVaultStorageDriver
  vault: MobileVaultConfig
}): Promise<MobileEditorDraftSaveResult> {
  if (!draft.persistable) {
    return { status: 'blocked', reason: draft.blockedReason }
  }

  const path = draftPath(draft)
  await storage.writeMarkdownFile(vault, path, draft.canonicalMarkdown)

  return { status: 'saved', path }
}

function draftPath(draft: MobileEditorDraft) {
  return `${draft.noteId}.md`
}
