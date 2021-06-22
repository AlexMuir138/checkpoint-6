<template>
  <div class="home container-fluid">
    <div class="row m-3 d-flex justify-content-center ">
      <div class="card bg-danger p-3 shadow-lg">
        <form class="form d-flex justify-content-center align-items-center" @submit.prevent="createBug">
          <label for="bug-title" class="p-3">
            <input type="text" class="form-control mb-3" placeholder="Title of Bug" name="board-title" v-model="state.newBug.title">
          </label>
          <label for="bug-description" class=" m-3">
            <textarea name="description body"
                      id=""
                      cols="50"
                      rows="3"
                      placeholder="Add Description"
                      class="form-control mb-1"
                      v-model="state.newBug.description"
            ></textarea>
          </label>
          <button type="submit" class="btn btn-primary m-3" title="Create Bug">
            Submit Bug
          </button>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <h2>Welcome Bugs</h2>
      </div>
    </div>
    <div>
      <button class="btn btn-primary" @click="sortClosed" title="Sort">
        Sort
      </button>
    </div>
    <div class="row d-flex justify-content-center">
      <div class="col-10">
        <Bug v-for="bug in state.bugs" :key="bug.id" :bug="bug" />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from '@vue/runtime-core'
import { bugsService } from '../services/BugsService'
import { AppState } from '../AppState'
import Notification from '../utils/Notification'
import { router } from '../router'

export default {
  name: 'Home',
  setup() {
    const state = reactive({
      newBug: {},
      sortClosed: true,
      bugs: computed(() => {
        if (state.sortClosed === true) {
          return AppState.bugs
        }
        return AppState.bugs.filter(c => c.closed === false)
      }

      )
    })
    onMounted(async() => {
      try {
        await bugsService.getBugs()
      } catch (error) {
        Notification.toast(error)
      }
    })

    return {
      state,
      async createBug() {
        const results =
        await bugsService.createBug(state.newBug)
        await bugsService.getBugs()
        router.push(`/bugs/${results.id}`)
      },
      sortClosed() {
        state.sortClosed = !state.sortClosed
      }
    }
  }
}
</script>

<style scoped lang="scss">
.home{
  text-align: center;
  user-select: none;
  > img{
    height: 200px;
    width: 200px;
  }
}
</style>
