<template>
  <!-- Enterキーでログインするため -->
  <form @submit.prevent="login">
    <authenticate-header :class="$style.header" />
    <authenticate-input
      label="traQ ID"
      :text="loginState.name"
      @input="setName"
      :class="$style.item"
    />
    <span :class="$style.item">
      <authenticate-input
        label="パスワード"
        type="password"
        :text="loginState.pass"
        @input="setPass"
      />
      <a
        href="https://portal.trap.jp/reset-password"
        v-show="state.showPasswordResetLink"
        :class="$style.forgotPassword"
        :style="styles.forgotPassword"
      >
        パスワードを忘れた
      </a>
    </span>
    <div :style="styles.error" :class="$style.error">
      <span v-if="loginState.error">{{ loginState.error }}</span>
    </div>
    <div :class="$style.buttons">
      <authenticate-button-primary label="ログイン" />
    </div>
    <template v-if="!isIOS && externalLogin.length > 0">
      <authenticate-separator label="または" :class="$style.separator" />
      <div :class="$style.exLoginButtons">
        <authenticate-button-secondary
          :class="$style.exLoginButton"
          v-show="externalLogin.includes('traQ')"
          label="traP"
          icon-name="traQ"
          @click="loginExternal('traq')"
        />
        <authenticate-button-secondary
          :class="$style.exLoginButton"
          v-show="externalLogin.includes('google')"
          label="Google"
          icon-mdi
          icon-name="google"
          @click="loginExternal('google')"
        />
        <authenticate-button-secondary
          :class="$style.exLoginButton"
          v-show="externalLogin.includes('github')"
          label="GitHub"
          icon-mdi
          icon-name="github"
          @click="loginExternal('github')"
        />
      </div>
    </template>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@vue/composition-api'
import useLogin from './use/login'
import store from '@/store'
import { makeStyles } from '@/lib/styles'
import { isIOSApp } from '@/lib/util/browser'
import useRedirectParam from './use/redirectParam'
import AuthenticateInput from './AuthenticateInput.vue'
import AuthenticateHeader from './AuthenticateHeader.vue'
import AuthenticateButtonPrimary from './AuthenticateButtonPrimary.vue'
import AuthenticateButtonSecondary from './AuthenticateButtonSecondary.vue'
import AuthenticateSeparator from './AuthenticateSeparator.vue'

const useStyles = () =>
  reactive({
    forgotPassword: makeStyles(theme => ({
      color: theme.ui.secondary
    })),
    error: makeStyles(theme => ({
      color: theme.accent.error
    }))
  })

export default defineComponent({
  name: 'LoginForm',
  components: {
    AuthenticateInput,
    AuthenticateHeader,
    AuthenticateButtonPrimary,
    AuthenticateButtonSecondary,
    AuthenticateSeparator
  },
  setup(_, context) {
    const redirectState = useRedirectParam(context)
    const { loginState, login, loginExternal, setName, setPass } = useLogin(
      redirectState
    )
    const styles = useStyles()
    const isIOS = isIOSApp()
    const state = reactive({
      // 簡易的にhost名で分岐させてる
      showPasswordResetLink: location.host === 'q.trap.jp'
    })
    const externalLogin = computed(
      () => store.state.app.version.flags.externalLogin
    )

    return {
      state,
      loginState,
      styles,
      setName,
      setPass,
      login,
      loginExternal,
      isIOS,
      externalLogin
    }
  }
})
</script>

<style lang="scss" module>
.item {
  margin: 24px 0;
  display: block;
}
.header {
  margin-bottom: 48px;
}
.forgotPassword {
  display: block;
  margin-top: 16px;
  font-size: 0.75rem;
}
.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 48px;
}
.separator {
  margin: 32px 0;
}
.exLoginButtons {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 32px;
}
.exLoginButton {
  margin: 0 8px;
}
.error {
  font-weight: bold;
}
</style>
