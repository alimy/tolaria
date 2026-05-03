import { describe, expect, it } from 'vitest'
import { createFixtureMobileVaultRepository } from './mobileVaultRepository'
import type { MobileNoteSource } from './mobileNoteProjection'

const sources: MobileNoteSource[] = [
  createSource('workflow', 'Workflow Orchestration Essay'),
  createSource('release', 'v2026-05-02'),
]

describe('mobile vault repository', () => {
  it('lists projected notes in vault order', async () => {
    const repository = createFixtureMobileVaultRepository(sources)
    const notes = await repository.listNotes()

    expect(notes.map((note) => note.id)).toEqual(['workflow', 'release'])
    expect(notes[0].title).toBe('Workflow Orchestration Essay')
  })

  it('reads a projected note by id', async () => {
    const repository = createFixtureMobileVaultRepository(sources)

    await expect(repository.readNote('release')).resolves.toMatchObject({
      id: 'release',
      title: 'v2026-05-02',
    })
  })

  it('returns null for missing notes', async () => {
    const repository = createFixtureMobileVaultRepository(sources)

    await expect(repository.readNote('missing')).resolves.toBeNull()
  })
})

function createSource(id: string, title: string): MobileNoteSource {
  return {
    id,
    type: 'Essay',
    icon: 'pen-nib',
    date: 'May 13, 2026',
    modified: '6h ago',
    filename: `${id}.md`,
    tags: ['Tolaria MVP'],
    content: `---\ntitle: ${title}\n---\n\n# ${title}\n\nBody text for ${title}.`,
  }
}
