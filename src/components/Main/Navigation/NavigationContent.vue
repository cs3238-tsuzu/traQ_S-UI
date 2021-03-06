<template>
  <div :class="$style.container">
    <navigation-content-title :current-navigation="currentNavigation" />
    <home v-show="currentNavigation === 'home'" :class="$style.content" />
    <channels
      v-show="currentNavigation === 'channels'"
      :class="$style.content"
    />
    <activity
      v-show="currentNavigation === 'activity'"
      :class="$style.content"
    />
    <users v-show="currentNavigation === 'users'" :class="$style.content" />
    <clip-folders
      v-show="currentNavigation === 'clips'"
      :class="$style.content"
    />
    <not-implemented
      v-show="currentNavigation === 'services'"
      :class="$style.content"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  PropType
} from '@vue/composition-api'
import store from '@/store'
import { NavigationItemType } from '@/components/Main/Navigation/use/navigationConstructor'
import Home from './NavigationContent/Home.vue'
import Channels from './NavigationContent/Channels.vue'
import Activity from './NavigationContent/Activity.vue'
import Users from './NavigationContent/Users.vue'
import NotImplemented from './NavigationContent/NotImplemented.vue'
import NavigationContentTitle from './NavigationContentTitle.vue'
import ClipFolders from './NavigationContent/ClipFolders.vue'

export default defineComponent({
  name: 'NavigationContent',
  components: {
    Home,
    Channels,
    Activity,
    Users,
    NotImplemented,
    NavigationContentTitle,
    ClipFolders
  },
  props: {
    currentNavigation: {
      type: String as PropType<NavigationItemType>,
      default: 'home' as const
    }
  },
  setup() {
    const state = reactive({
      channels: computed(() => store.state.entities.channels)
    })
    const topLevelChannels = computed(
      () => store.state.domain.channelTree.channelTree.children ?? []
    )

    return { state, topLevelChannels }
  }
})
</script>

<style lang="scss" module>
.container {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: {
    top: 24px;
    left: 24px;
  }
}
.content {
  margin: 24px 0;
}
</style>
