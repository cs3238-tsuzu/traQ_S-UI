<template>
  <div :class="$style.container" :style="styles.container">
    <span :class="$style.text" @click="withClose(removePinned)" v-if="isPinned">
      ピン留めを外す
    </span>
    <span :class="$style.text" @click="withClose(addPinned)" v-else>
      ピン留め
    </span>
    <span :class="$style.text" @click="withClose(showClipCreateModal)"
      >クリップ</span
    >
    <span :class="$style.text" @click="withClose(editMessage)" v-if="isMine"
      >編集</span
    >
    <span :class="$style.text" @click="withClose(copyLink)">
      リンクをコピー
    </span>
    <span :class="$style.text" @click="withClose(copyMd)">
      Markdownをコピー
    </span>
    <span :class="$style.text" @click="withClose(deleteMessage)" v-if="isMine">
      削除
    </span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  PropType
} from '@vue/composition-api'
import store from '@/store'
import apis, { embeddingOrigin } from '@/lib/apis'
import { makeStyles } from '@/lib/styles'
import { MessageId } from '@/types/entity-ids'
import clipboard from '@cloudcmd/clipboard'

const useStyles = () =>
  reactive({
    container: makeStyles((theme, common) => ({
      filter: common.dropShadow.default,
      background: theme.background.primary,
      color: theme.ui.secondary
    }))
  })

const usePinToggler = (props: { messageId: MessageId }) => {
  const addPinned = () => {
    store.dispatch.domain.messagesView.addPinned({
      messageId: props.messageId
    })
  }
  const removePinned = () => {
    store.dispatch.domain.messagesView.removePinned({
      messageId: props.messageId
    })
  }
  return { addPinned, removePinned }
}

const useMessageChanger = (props: { messageId: MessageId }) => {
  const editMessage = () => {
    store.commit.domain.messagesView.setEditingMessageId(props.messageId)
  }
  const deleteMessage = () => {
    if (confirm('本当にメッセージを削除しますか？')) {
      apis.deleteMessage(props.messageId)
    }
  }
  return { editMessage, deleteMessage }
}

const useCopy = (props: { messageId: MessageId }) => {
  const copyLink = async () => {
    const link = `${embeddingOrigin}/messages/${props.messageId}`
    await clipboard.writeText(link)
  }
  const copyMd = async () => {
    await clipboard.writeText(
      store.state.entities.messages[props.messageId]?.content ?? ''
    )
  }
  return { copyLink, copyMd }
}

const useShowClipCreateModal = (props: { messageId: MessageId }) => {
  const showClipCreateModal = () => {
    store.dispatch.ui.modal.pushModal({
      type: 'clip-create',
      messageId: props.messageId
    })
  }
  return { showClipCreateModal }
}

export default defineComponent({
  name: 'MessageToolsMenu',
  props: { messageId: { type: String as PropType<MessageId>, required: true } },
  setup(props) {
    const styles = useStyles()
    const isPinned = computed(() =>
      store.getters.domain.messagesView.isPinned(props.messageId)
    )
    const isMine = computed(
      () =>
        store.state.entities.messages[props.messageId]?.userId ===
        store.state.domain.me.detail?.id
    )
    const { copyLink, copyMd } = useCopy(props)
    const { addPinned, removePinned } = usePinToggler(props)
    const { editMessage, deleteMessage } = useMessageChanger(props)
    const { showClipCreateModal } = useShowClipCreateModal(props)
    const withClose = async (func: () => void | Promise<void>) => {
      await func()
      store.dispatch.ui.messageContextMenu.closeMessageContextMenu()
    }
    return {
      styles,
      isPinned,
      addPinned,
      removePinned,
      copyLink,
      copyMd,
      isMine,
      editMessage,
      deleteMessage,
      showClipCreateModal,
      withClose
    }
  }
})
</script>

<style lang="scss" module>
.container {
  display: grid;
  width: max-content;
  padding: 8px 16px;
  border-radius: 4px;
  position: absolute;
}

.text {
  margin: 2px 0;
  cursor: pointer;
}
</style>
