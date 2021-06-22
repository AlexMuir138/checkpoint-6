<template>
  <div class="container-fluid">
    <div class="card border shadow-lg m-3 p-3">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          {{ note.body }}

          <button @click="deleteNote" v-if="note.creatorId === account.id" class="mdi mdi-trash-can-outline text-warning bg-secondary rounded" title="Close Bug"></button>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-end p-2 m-3">
      {{ note.creator.name }}
      <img :src="note.creator.picture" alt="creator" height="30" class="rounded-pill mx-3">
    </div>
  </div>
</template>

<script>
import { AppState } from '../AppState'
import { computed } from '@vue/runtime-core'
import { notesService } from '../services/NotesService'
import { useRoute } from 'vue-router'
import Notification from '../utils/Notification'

export default {
  props: { note: { type: Object, required: true } },
  setup(props) {
    const route = useRoute()

    return {
      account: computed(() => AppState.account),
      async deleteNote() {
        if (await Notification.confirmAction()) {
          await notesService.deleteNote(props.note.id)
          await notesService.getNotesById(route.params.id)
        }
      }

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
