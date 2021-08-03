<template>
  <div class="row border-2 p-3 m-3 shadow-lg">
    <div class="col-3">
      <router-link :to="{name: 'BugDetails', params: {id: bug.id}}">
        <u>{{ bug.title }}</u>
      </router-link>
    </div>
    <div class="col-3">
      <div class="d-flex align-items-column justify-content-center">
        {{ bug.creator.name }}
        <img :src="bug.creator.picture" alt="creator" height="30" class="rounded-pill mx-3">
      </div>
    </div>
    <div class="col-3">
      <span v-if="bug.closed === true" class="text-danger">Closed</span>
      <span v-else class="text-success mx-3">Open

        <i @click="closeBug" v-if="bug.creatorId === account.id" class="mdi mdi-trash-can-outline text-warning bg-secondary rounded" title="Close Bug"></i>
      </span>
    </div>
    <div class="col-3">
      <u>{{ updatedAt(bug.updatedAt) }}</u>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { AppState } from '../AppState'
import moment from 'moment'
import Notification from '../utils/Notification'
import { bugsService } from '../services/BugsService'
import { useRoute } from 'vue-router'

export default {
  props: { bug: { type: Object, required: true } },
  setup(props) {
    const route = useRoute()
    return {
      account: computed(() => AppState.account),
      updatedAt(updatedAt) {
        const x = moment(updatedAt).format('MM-DD-YYYY')
        return x
      },
      async closeBug() {
        if (await Notification.confirmAction()) {
          await bugsService.closeBug(props.bug.id)
          await bugsService.getBugs(route.params.id)
        }
      }
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
