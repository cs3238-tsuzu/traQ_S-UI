<template>
  <section :class="$style.feature">
    <div>
      <h1>{{ user.displayName }}</h1>
      <p>
        <online-indicator :user-id="user.id" />
        @{{ user.name }}
      </p>
    </div>
    <buttons
      :home-channel-id="props.detail ? props.detail.homeChannel : undefined"
      :user-name="user.name"
      show-title
    />
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { User, UserDetail } from '@traptitech/traq'
import OnlineIndicator from './OnlineIndicator.vue'
import Buttons from './Buttons.vue'

export default defineComponent({
  name: 'DesktopFeature',
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    detail: Object as PropType<UserDetail>
  },
  setup(props) {
    return {
      // TODO: https://github.com/vuejs/composition-api/issues/291
      props: props as { detail?: UserDetail }
    }
  },
  components: {
    OnlineIndicator,
    Buttons
  }
})
</script>

<style lang="scss" module>
.feature {
  grid-column: 1/3;
  text-align: center;
}
</style>
