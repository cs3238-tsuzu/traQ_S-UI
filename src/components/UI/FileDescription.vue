<template>
  <div :class="$style.container" :style="styles.container">
    <div :class="$style.icon">
      <icon mdi :name="fileIconName" :size="36" />
    </div>
    <div
      :class="$style.fileName"
      :data-is-ellipsis="props.isEllipsis"
      :data-is-no-ellipsis="!props.isEllipsis"
    >
      {{ fileMeta.name }}
    </div>
    <div :class="$style.fileSize" :style="styles.fileSize">
      {{ fileSize }}
    </div>
    <div :class="$style.dl" @click="onFileDownloadLinkClick">
      <icon mdi name="download" :size="24" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
import { makeStyles } from '@/lib/styles'
import useFileMeta from '@/use/fileMeta'
import Icon from '@/components/UI/Icon.vue'

const useStyles = (props: { isWhite: boolean; isEllipsis: boolean }) =>
  reactive({
    container: makeStyles((theme, common) => ({
      color: props.isWhite ? common.text.whitePrimary : theme.ui.primary
    })),
    fileSize: makeStyles((theme, common) => ({
      color: props.isWhite ? common.text.whiteSecondary : theme.ui.secondary
    }))
  })

export default defineComponent({
  name: 'FileDescription',
  components: {
    Icon
  },
  props: {
    fileId: {
      type: String,
      required: true
    },
    isWhite: {
      type: Boolean,
      default: false
    },
    isEllipsis: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const styles = useStyles(props)
    const {
      fileMeta,
      fileIconName,
      fileSize,
      onFileDownloadLinkClick
    } = useFileMeta(props, context)
    return {
      props,
      styles,
      fileMeta,
      fileIconName,
      fileSize,
      onFileDownloadLinkClick
    }
  }
})
</script>

<style lang="scss" module>
.container {
  display: grid;
  width: 100%;
  grid-template:
    'icon ... name ... dl' minmax(min-content, 20px)
    'icon ... size ... dl' minmax(min-content, 16px)
    / 36px 16px auto 1fr 24px;
}
.icon,
.dl {
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon {
  grid-area: icon;
}
.dl {
  grid-area: dl;
  cursor: pointer;
}
.fileName {
  grid-area: name;
  min-width: 0;
  &[data-is-ellipsis] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &[data-is-no-ellipsis] {
    overflow-wrap: break-word;
  }
}
.fileSize {
  grid-area: size;
  display: flex;
  align-items: center;
}
</style>
