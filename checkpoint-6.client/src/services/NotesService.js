import { AppState } from '../AppState'
import { Note } from '../models/Note'
import { logger } from '../utils/Logger'
import { api } from './AxiosService'

class NotesService {
  async getNotesById(id) {
    const res = await api.get(`api/bugs/${id}/notes`)
    logger.log(res.data)
    AppState.notes = res.data.map(n => new Note(n))
  }

  async deleteNote(id) {
    const res = await api.delete(`api/notes/${id}`)
    console.log(res)
  }

  async createNote(noteData) {
    const res = await api.post('api/notes', noteData)
    AppState.notes.push(new Note(res.data))
  }
}
export const notesService = new NotesService()
