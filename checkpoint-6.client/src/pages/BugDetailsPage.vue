<template>
  <div class="container-fluid">
    <div v-if="bug" class="row d-flex align-items-column justify-content-center m-4 mb-5">
      <div class="col-6 mt-4">
        <div v-if="bug.creatorId === account.id" class="">
          <form v-if="bug.closed === false" class="form text-center" @submit.prevent="editBug">
            <h4>Need to Edit Your Bug?</h4>
            <div for="bug-title">
              <input type="text"
                     class="form-control"
                     placeholder="Edit Bug Title"
                     name="board-title"
                     title="Edit Bug Title"
                     v-model="state.editedBug.title"
              >
            </div>
            <div for="bug-description" class="m-3">
              <textarea name="description body"
                        id=""
                        cols="50"
                        rows="3"
                        placeholder="Edit Description"
                        class="form-control"
                        title="Edit Description Body"
                        v-model="state.editedBug.description"
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary" title="Create Bug">
              Submit Edit
            </button>
          </form>
        </div>
      </div>
    </div>
    <div v-if="bug" class="text-primary mx-5">
      <h2><u>{{ bug.title }}</u></h2>
    </div>
    <div class="card border shadow-lg mx-4">
      <div class="row" v-if="bug">
        <div class="col-12 d-flex justify-content-center align-items-column p-3 m-3">
          <h3>
            Bug Description:
          </h3>
        </div>
        <div class="col-12 d-flex justify-content-center align-items-column mb-5">
          <div>
            <u>{{ bug.description }}</u>
          </div>
        </div>
        <div class="col-12 d-flex justify-content-between">
          <div class="mx-3">
            <h4>Status:</h4>
            <span v-if="bug.closed === true" class="text-danger">Closed</span>
            <span v-else class="text-success mx-3">Open
              <i @click="closeBug" v-if="bug.creatorId === account.id" class="mdi mdi-trash-can-outline text-warning bg-secondary rounded" title="Close Bug"></i>
            </span>
          </div>
          <div v-if="bug" class="mx-3 p-3">
            <h4>Submitted by:</h4>
            {{ bug.creator.name }}
            <img :src="bug.creator.picture" class="rounded-circle" alt="creator" height="30">
          </div>
        </div>
      </div>
    </div>
    <Note v-for="note in notes" :key="note.id" :note="note" />
    <div class="card bg-dark m-3 p-3 shadow-lg">
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
