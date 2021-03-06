<template>
  <div :class="$style.container">
    <div :class="$style.input">
      <filter-input on-secondary :text="text" @input="onInput" />
    </div>
    <button :class="$style.star" :style="styles.star">
      <icon
        @click="context.emit('click')"
        name="star"
        :width="22"
        :height="22"
        mdi
      />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
import FilterInput from '@/components/UI/FilterInput.vue'
import Icon from '@/components/UI/Icon.vue'
import { makeStyles } from '@/lib/styles'
import { transparentize } from '@/lib/util/color'

const useStyles = (props: { isStared: boolean }) =>
  reactive({
    star: makeStyles(theme => ({
      color: props.isStared
        ? theme.accent.primary
        : transparentize(theme.ui.secondary, 0.5),
      backgroundColor: theme.background.primary
    }))
  })

export default defineComponent({
  name: 'ChannelFilter',
  components: {
    Icon,
    FilterInput
  },
  props: {
    text: {
      type: String,
      required: true
    },
    isStared: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const styles = useStyles(props)
    const onInput = (value: string) => {
      context.emit('input', value)
    }
    return {
      context,
      styles,
      onInput
    }
  }
})
</script>

<style lang="scss" module>
.container {
  display: flex;
  align-items: center;
}
.input {
  margin-right: 16px;
}
.star {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 4px;
  margin-right: 16px;
  cursor: pointer;
}
</style>
