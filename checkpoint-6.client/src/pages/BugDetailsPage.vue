<template>
  <div class="container-fluid">
    <div v-if="bug">
      <div v-if="bug.creatorId === account.id" class="row d-flex justify-content-center align-items-center">
        <form v-if="bug.closed === false" class="form " @submit.prevent="editBug">
          <label for="bug-title" class="m-3 mx-3">
            <input type="text"
                   class="form-control mb-3"
                   placeholder="Edit Bug Title"
                   name="board-title"
                   title="Edit Bug Title"
                   v-model="state.editedBug.title"
            >
          </label>
          <label for="bug-description" class="m-3">
            <textarea name="description body"
                      id=""
                      cols="50"
                      rows="3"
                      placeholder="Edit Description"
                      class="form-control mb-1"
                      title="Edit Description Body"
                      v-model="state.editedBug.description"
            ></textarea>
          </label>
          <button type="submit" class="btn btn-primary mb-2" title="Create Bug">
            Submit Bug
          </button>
        </form>
      </div>
    </div>
    <div v-if="bug" class="d-flex justify-content-center text-danger">
      <h1><u>{{ bug.title }}</u></h1>
    </div>
    <div class="card border shadow-lg mx-4">
      <div class="row" v-if="bug">
        <div class="col-12 d-flex justify-content-between p-3 m-3">
          {{ bug.description }}
          <div class="col-4">
            <span v-if="bug.closed === true" class="text-danger">Closed</span>

            <span v-else class="text-success mx-3">Open

              <i @click="closeBug" v-if="bug.creatorId === account.id" class="mdi mdi-trash-can-outline text-warning bg-secondary rounded" title="Close Bug"></i>

            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="bug" class="d-flex justify-content-center">
      {{ bug.creator.name }}
      <img :src="bug.creator.picture" alt="creator" height="30">
    </div>
    <Note v-for="note in notes" :key="note.id" :note="note" />
    <div class="card bg-warning m-3 p-3 shadow-lg">
      <form class="form d-flex justify-content-center" @submit.prevent="createNote">
        <label for="note-body" class="m-3" title="Add Note Text">
          <textarea name="body"
                    id=""
                    cols="50"
                    rows="3"
                    placeholder="Add Note"
                    class="form-control mb-1"
                    v-model="state.newNote.body"
          ></textarea>
        </label>
        <button type="submit" class="btn btn-primary m-4" title="Create Note">
          Submit Note
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { bugsService } from '../services/BugsService'
import { notesService } from '../services/NotesService'
import { AppState } from '../AppState'
import Notification from '../utils/Notification'
export default {
  setup() {
    const route = useRoute()
    const state = reactive({
      newNote: {},
      editedBug: {},
      bug: {}
    })
    onMounted(async() => {
      await bugsService.getBugById(route.params.id)
      await notesService.getNotesById(route.params.id)
    })
    return {
      state,
      account: computed(() => AppState.account),
      bug: computed(() => AppState.activeBug),
      notes: computed(() => AppState.notes),
      async createNote() {
        const noteData = state.newNote
        noteData.bug = route.params.id
        await notesService.createNote(noteData)
        await notesService.getNotesById(route.params.id)
      },
      async editBug() {
        const editData = state.editedBug
        editData.bug = route.params.id
        await bugsService.editBug(state.editedBug)
        await bugsService.getBugById(route.params.id)
      },
      async closeBug() {
        if (await Notification.confirmAction()) {
          await bugsService.closeBug(route.params.id)
          await bugsService.getBugById(route.params.id)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
