<template>
  <div
    :class="$style.body"
    :style="styles.body"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    ref="bodyRef"
    v-if="state.message"
    :data-is-mobile="isMobile"
  >
    <message-pinned
      :message-id="messageId"
      v-if="state.message.pinned"
      :class="$style.pinned"
    />
    <user-icon
      :class="$style.userIcon"
      :user-id="state.message.userId"
      :size="40"
    />
    <message-header
      :class="$style.messageHeader"
      :user-id="state.message.userId"
      :created-at="state.message.createdAt"
      :updated-at="state.message.updatedAt"
    />
    <message-tools
      :class="$style.tools"
      :message-id="messageId"
      v-if="hoverState.hover"
    />
    <div :class="$style.messageContents">
      <div
        v-show="!state.isEditing"
        :class="['markdown-body', $style.content]"
        v-html="state.content"
      />
      <message-editor
        v-if="state.isEditing"
        :raw-content="state.rawContent"
        :message-id="messageId"
      />
      <message-quote-list
        v-if="embeddingsState.quoteMessageIds.length > 0"
        :class="$style.messageEmbeddingsList"
        :message-ids="embeddingsState.quoteMessageIds"
      />
      <message-file-list
        v-if="embeddingsState.fileIds.length > 0"
        :class="$style.messageEmbeddingsList"
        :file-ids="embeddingsState.fileIds"
      />
      <div :class="$style.stampWrapper">
        <icon
          name="rounded-triangle"
          :size="20"
          v-if="state.message.stamps.length > 0"
          :class="$style.toggleButton"
          :style="styles.toggleButton"
          @click="onStampDetailFoldingToggle"
        />
        <message-stamp-list
          :class="$style.stamps"
          v-if="state.message.stamps.length > 0"
          :message-id="messageId"
          :stamps="state.message.stamps"
          :is-show-detail="state.stampDetailFoldingState"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  ref,
  PropType
} from '@vue/composition-api'
import store from '@/store'
import { makeStyles } from '@/lib/styles'
import { transparentize } from '@/lib/util/color'
import { MessageId } from '@/types/entity-ids'
import useHover from '@/use/hover'
import useIsMobile from '@/use/isMobile'
import UserIcon from '@/components/UI/UserIcon.vue'
import MessageHeader from './MessageHeader.vue'
import MessageEditor from './MessageEditor.vue'
import MessageStampList from './MessageStampList.vue'
import MessageFileList from './MessageFileList.vue'
import MessageQuoteList from './MessageQuoteList.vue'
import useElementRenderObserver from './use/elementRenderObserver'
import MessageTools from './MessageTools.vue'
import useEmbeddings from './use/embeddings'
import Icon from '@/components/UI/Icon.vue'
import { Message } from '@traptitech/traq'
import MessagePinned from './MessagePinned.vue'

const useStyles = (
  props: { isEntryMessage: boolean },
  hoverState: { hover: boolean },
  state: {
    message?: Message
    stampDetailFoldingState: boolean
    isEditing: boolean
  }
) =>
  reactive({
    body: makeStyles((theme, common) => ({
      background: state.message?.pinned
        ? transparentize(common.ui.pin, 0.2)
        : props.isEntryMessage
        ? transparentize(theme.accent.notification, 0.1)
        : hoverState.hover && !state.isEditing
        ? transparentize(theme.background.secondary, 0.6)
        : 'transparent'
    })),
    toggleButton: makeStyles(theme => ({
      transform: state.stampDetailFoldingState
        ? `rotate(0.5turn)`
        : `rotate(0turn)`,
      color: hoverState.hover ? theme.ui.secondary : 'transparent'
    }))
  })

export default defineComponent({
  name: 'MessageElement',
  components: {
    UserIcon,
    MessageHeader,
    MessageEditor,
    MessageStampList,
    MessageFileList,
    MessageQuoteList,
    Icon,
    MessageTools,
    MessagePinned
  },
  props: {
    messageId: {
      type: String as PropType<MessageId>,
      required: true
    },
    isEntryMessage: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const { hoverState, onMouseEnter, onMouseLeave } = useHover()
    const bodyRef = ref<HTMLDivElement>(null)
    const { isMobile } = useIsMobile()
    const state = reactive({
      message: computed(() => store.state.entities.messages[props.messageId]),
      content: computed(
        () =>
          store.state.domain.messagesView.renderedContentMap[props.messageId] ??
          ''
      ),
      rawContent: computed(
        () => store.state.entities.messages[props.messageId]?.content ?? ''
      ),
      isEditing: computed(
        () =>
          props.messageId === store.state.domain.messagesView.editingMessageId
      ),
      stampDetailFoldingState: false
    })

    const { embeddingsState } = useEmbeddings(props)

    useElementRenderObserver(bodyRef, props, state, embeddingsState, context)

    const onStampDetailFoldingToggle = () => {
      state.stampDetailFoldingState = !state.stampDetailFoldingState
    }

    const styles = useStyles(props, hoverState, state)

    return {
      state,
      styles,
      onMouseEnter,
      onMouseLeave,
      bodyRef,
      embeddingsState,
      isMobile,
      onStampDetailFoldingToggle,
      hoverState
    }
  }
})
</script>

<style lang="scss" module>
$messagePadding: 32px;
$messagePaddingMobile: 16px;

.body {
  position: relative;
  display: grid;
  grid-template:
    'pinned pinned'
    'user-icon message-header'
    'user-icon message-contents'
    '... message-contents';
  grid-template-rows: auto 20px 1fr;
  grid-template-columns: 42px 1fr;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  padding: 8px $messagePadding;
  &[data-is-mobile='true'] {
    padding: 8px $messagePaddingMobile;
  }
}

.pinned {
  grid-area: pinned;
  height: 28px;
  padding: {
    top: 4px;
    bottom: 8px;
  }
}

.userIcon {
  grid-area: user-icon;
  margin-top: 2px;
}

.messageHeader {
  grid-area: message-header;
  padding-left: 8px;
}

.messageContents {
  grid-area: message-contents;
  padding-top: 4px;
  padding-left: 8px;
  min-width: 0;
}

.content {
  grid-area: message-contents;
  word-break: break-word;
  word-wrap: break-word;
  line-break: loose;
}

.stampWrapper {
  margin-top: 8px;
  position: relative;
}

.toggleButton {
  position: absolute;
  left: -26px;
  top: 2px;
  cursor: pointer;
}

.messageEmbeddingsList {
  margin-top: 16px;
}

.tools {
  position: absolute;
  top: 4px;
  right: 16px;
  z-index: 1;
}
</style>
