import { projectMobileNotes, type MobileNote, type MobileNoteSource } from './mobileNoteProjection'

export type MobileVaultRepository = {
  listNotes: () => Promise<MobileNote[]>
  readNote: (id: string) => Promise<MobileNote | null>
}

export function createFixtureMobileVaultRepository(sources: MobileNoteSource[]): MobileVaultRepository {
  const notes = projectMobileNotes(sources)

  return {
    listNotes: () => Promise.resolve(notes),
    readNote: (id) => Promise.resolve(notes.find((note) => note.id === id) ?? null),
  }
}
