<template>
  <transition name="dialog-fade">
    <div v-if="isShowing" class="dialog dialog-text" @click.stop="hide">
      <div class="dialog-content" @click.stop="">
        <div class="dialog-title dialog-row">
          Text
        </div>
        <textarea v-model="contentText" class="dialog-content-text dialog-row" name="content-text" />
        <div class="dialog-btns">
          <button class="dialog-btn normal" @click="onClickCancel">
            Cancel
          </button>
          <button class="dialog-btn primary" @click="onClickSubmit">
            Submit
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
export default defineComponent({
  setup (_props, context) {
    const isShowing = ref<boolean>(false)
    const contentText = ref<string>('')

    const show = () => {
      isShowing.value = true
    }
    const hide = () => {
      isShowing.value = false
    }

    const onClickCancel = () => {
      hide()
      context.emit('cancel')
    }
    const onClickSubmit = () => {
      hide()
      context.emit('submitText', contentText.value)
    }

    return {
      isShowing,
      contentText,
      show,
      hide,
      onClickCancel,
      onClickSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~~/assets/dialog.scss";

div.dialog-content {
    max-height: 320px;
}

textarea.dialog-content-text {
    width: 100%;
    flex-grow: 1;
    border-radius: 0.5rem;
    border: #aaaaaa 1px solid;
    padding: 1rem;
}

div.dialog-btns {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    button.dialog-btn:not(:last-child) {
        margin-right: 1rem;
    }
}
</style>
