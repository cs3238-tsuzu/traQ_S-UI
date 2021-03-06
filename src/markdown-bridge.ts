import store from '@/store'
import { UserId, UserGroupId } from '@/types/entity-ids'
import { changeChannelByPath } from './router/channel'

interface ExtendedWindow extends Window {
  /**
   * ユーザーモーダルを開く
   * レンダリングされたmarkdown本文に埋め込まれるリンク(`@user`)のクリック時に呼び出される
   * @param userId ユーザーID
   */
  openUserModal(userId: string): void

  /**
   * グループモーダルを開く
   * レンダリングされたmarkdown本文に埋め込まれるリンク(`@group`)のクリック時に呼び出される
   * @param userGroupId ユーザーグループID
   */
  openGroupModal(userGroupId: string): void

  /**
   * チャンネルを切り替える
   * レンダリングされたmarkdown本文に埋め込まれるリンク(`#channel`)のクリック時に呼び出される
   * @param channelPath チャンネルのパス(`#`は含まない、`/`区切り)
   */
  changeChannel(channelPath: string): void
}
declare const window: ExtendedWindow

export const setupGlobalFuncs = () => {
  window.openUserModal = (userId: UserId) => {
    store.dispatch.ui.modal.pushModal({
      type: 'user',
      id: userId
    })
  }

  window.openGroupModal = (userGroupId: UserGroupId) => {
    store.dispatch.ui.modal.pushModal({
      type: 'group',
      id: userGroupId
    })
  }

  window.changeChannel = (channelPath: string) => {
    changeChannelByPath(channelPath)
  }
}
