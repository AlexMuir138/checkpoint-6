<template>
  <div class="container-fluid">
    <div class="card border shadow-lg m-3 p-3">
      <div class="row">
        <div class="col-12">
          {{ note.body }}
        </div>
        <div class="col-12">
          <div class="d-flex justify-content-end">
            <span class="mx-2">Submitted By:  </span>
            {{ note.creator.name }}
            <img :src="note.creator.picture" alt="creator" height="30" class="rounded-pill mx-3">
            <button @click="deleteNote" v-if="note.creatorId === account.id" class="mdi mdi-trash-can-outline text-warning bg-secondary rounded" title="Close Bug"></button>
          </div>
        </div>
      </div>
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
