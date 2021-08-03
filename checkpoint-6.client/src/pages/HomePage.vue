<template>
  <div class="home container-fluid">
    <h3 class="mt-5">
      Something Bugging you?
    </h3>

    <!-- Add Bug Trigger -->
    <button type="button" class="button btn btn-info shadow mb-5" data-toggle="modal" data-target="#exampleModal">
      Report a New Bug
    </button>

    <!-- Add Bug Modal -->
    <div class="modal fade"
         id="exampleModal"
         tabindex="-1"
         role="dialog"
         aria-labelledby="exampleModalLabel"
         aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Modal title
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="form " @submit.prevent="createBug">
              <div for="bug-title" class="p-3">
                <input type="text"
                       class="form-control mb-3"
                       placeholder="Title of Bug"
                       name="board-title"
                       required
                       v-model="state.newBug.title"
                >
              </div>
              <div for="bug-description" class=" m-3">
                <textarea name="description body"
                          id=""
                          cols="50"
                          rows="3"
                          placeholder="Add Description"
                          class="form-control mb-1"
                          required
                          v-model="state.newBug.description"
                ></textarea>
              </div>
              <button type="submit" class="button btn btn-primary m-3 shadow" title="Create Bug">
                Submit Bug
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row d-flex justify-content-center">
      <div class="col-8">
        <div class="d-flex justify-content-between">
          All Bugs
          <div>
            <button class="button btn btn-primary shadow" @click="sortClosed" title="Sort">
              Toggle Open Bugs
            </button>
          </div>
        </div>
      </div>
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
      sortOpen: true,
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

.button{
  transition: all .2s ease-in-out;
}
.button:hover {
  transform: scale(1.1); }
</style>
