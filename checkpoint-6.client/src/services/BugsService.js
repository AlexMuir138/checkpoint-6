import { AppState } from '../AppState'
import { Bug } from '../models/Bug'
const { logger } = require('../utils/Logger')
const { api } = require('./AxiosService')

class BugsService {
  async getBugs() {
    const res = await api.get('api/bugs')
    logger.log(res.data)
    AppState.bugs = res.data.map(b => new Bug(b))
  }

  async getBugById(id) {
    const res = await api.get(`api/bugs/${id}`)
    AppState.activeBug = res.data
    console.log(res.data)
  }

  async createBug(bugData) {
    const res = await api.post('api/bugs', bugData)
    AppState.bugs.push(new Bug(res.data))
    return res.data
  }

  async editBug(edit) {
    const res = await api.put(`api/bugs/${edit.bug}`, edit)
    return res.data
  }

  async closeBug(id) {
    const res = await api.delete(`api/bugs/${id}`)
    console.log(res)
  }
}
export const bugsService = new BugsService()
