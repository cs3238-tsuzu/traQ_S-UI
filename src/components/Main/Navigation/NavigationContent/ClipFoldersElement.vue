<template>
  <router-link
    :to="clipFolderPath"
    :class="$style.container"
    :style="styles.container"
  >
    <icon name="bookmark" mdi :class="$style.icon" />
    <span :class="$style.name">
      {{ clipFolder.name }}
    </span>
  </router-link>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  PropType,
  computed
} from '@vue/composition-api'
import { makeStyles } from '@/lib/styles'
import { ClipFolder } from '@traptitech/traq'
import Icon from '@/components/UI/Icon.vue'
import { constructClipFoldersPath } from '@/router'

const useStyles = () =>
  reactive({
    container: makeStyles(theme => ({
      color: theme.ui.primary
    }))
  })

export default defineComponent({
  name: 'ClipFoldersElement',
  components: {
    Icon
  },
  props: {
    clipFolder: {
      type: Object as PropType<ClipFolder>,
      required: true
    }
  },
  setup(props) {
    const styles = useStyles()
    const clipFolderPath = computed(() =>
      constructClipFoldersPath(props.clipFolder.id)
    )
    return { styles, clipFolderPath }
  }
})
</script>

<style lang="scss" module>
.container {
  display: flex;
  padding: 2px;
  cursor: pointer;
  font-size: 1rem;
}
.icon {
  flex-shrink: 0;
  margin-right: 16px;
}
.name {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
