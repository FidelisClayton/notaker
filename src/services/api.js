import uuidv4 from 'uuid/v4'
import { db } from './firebase'

export async function createNote (note) {
  const id = uuidv4()

  db.ref(`/notes-indexes/${id}`).set({
    id: id,
    title: 'Empty note'
  })

  await db.ref(`/notes/${id}`).set({ ...note, id })

  return id
}

export async function deleteNote (id) {
  db.ref(`/notes-indexes/${id}`).remove()
  return await db.ref(`/notes/${id}`).remove()
}

export async function updateNoteTitle (id, title) {
  db.ref(`/notes-indexes/${id}/title`).set(title)
  return await db.ref(`/notes/${id}/title`).set(title)
}

export async function updateNote (id, markdown) {
  return await db.ref(`/notes/${id}`).set({
    updatedAt: Date.now(),
    markdown: markdown
  })
}

export async function getNotes () {
  return await db.ref(`/notes-indexes`).once('value')
}

export async function getNote (id) {
  return await db.ref(`/notes/${id}`).once('value')
}
