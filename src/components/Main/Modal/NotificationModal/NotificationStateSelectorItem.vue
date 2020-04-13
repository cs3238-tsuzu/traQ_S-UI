<template>
  <div :class="$style.container" :style="styles.container">
    <icon :class="$style.icon" :name="iconName" :mdi="iconMdi" />
    <span :class="$style.title">{{ title }}</span>
    <span :class="$style.description" :style="styles.description">{{
      description
    }}</span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  computed
} from '@vue/composition-api'
import store from '@/store'
import { makeStyles } from '@/lib/styles'
import Icon from '@/components/UI/Icon.vue'
import { SubscriptionLevel } from '@/store/domain/me'

const titleMap: Record<SubscriptionLevel, string> = {
  notified: '通知オン',
  subscribed: '未読のみ管理',
  none: 'なし'
}
const descriptionMap: Record<SubscriptionLevel, string> = {
  notified: '新規メッセージの通知を送信します',
  subscribed:
    '新規メッセージの有無をチャンネルリストに表示し、通知は送信しません',
  none: '未読の管理・通知を行いません'
}
const iconNameMap: Record<SubscriptionLevel, string> = {
  notified: 'bell',
  subscribed: 'subscribed',
  none: 'bell-outline'
}
const iconMdiMap: Record<SubscriptionLevel, boolean> = {
  notified: true,
  subscribed: false,
  none: true
}

const useStyles = (props: { isSelected: boolean }) =>
  reactive({
    container: makeStyles(theme => ({
      color: props.isSelected ? theme.accent.primary : theme.ui.primary,
      opacity: props.isSelected ? '1' : '0.5'
    })),
    description: makeStyles(theme => ({
      color: theme.ui.primary
    }))
  })

export default defineComponent({
  name: 'NotificationSelectorItem',
  components: {
    Icon
  },
  props: {
    subscriptionLevel: {
      type: String as PropType<SubscriptionLevel>,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const styles = useStyles(props)
    const iconName = computed(() => {
      if (props.subscriptionLevel === 'notified') return 'bell'
      if (props.subscriptionLevel === 'subscribed') return 'subscribed'
      else return 'bell-outline'
    })
    const iconMdi = computed(() => {
      if (props.subscriptionLevel === 'notified') return true
      if (props.subscriptionLevel === 'subscribed') return false
      else return true
    })
    const title = computed(() => titleMap[props.subscriptionLevel])
    const description = computed(() => descriptionMap[props.subscriptionLevel])
    return { styles, iconName, iconMdi, title, description }
  }
})
</script>

<style lang="scss" module>
.container {
  display: grid;
  grid-template:
    'icon title' 24px
    '.... description' 1fr /
    24px 1fr;
  column-gap: 16px;
  width: 100%;
  user-select: none;
  cursor: pointer;
}
.icon {
  font-size: 1rem;
  grid-area: icon;
}
.title {
  font: {
    size: 1rem;
    weight: bold;
  }
  grid-area: title;
}
.description {
  font-size: 0.75rem;
  grid-area: description;
}
</style>