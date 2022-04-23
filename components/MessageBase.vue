<template>
  <div :class="['message', messageClass]">
    <div class="message-content">
      <p v-if="messageType === MessageType.Text" v-text="messageText.content.text" />
      <p v-if="messageType === MessageType.File" v-text="`File: ${messageFile.content.filename}`" />
    </div>
  </div>
</template>

<script lang="ts">import { Message, MessageText, MessageType, MessageFile } from '~~/types/Message'

export default defineComponent({
  props: {
    messageData: {
      type: Object as () => Message,
      require: true,
      default: null
    }
  },
  setup (props) {
    const messageClass = computed(() => {
      switch (props.messageData.getType()) {
        case MessageType.File:
          return 'message-file'
        case MessageType.Text:
          return 'message-text'
        default:
          return ''
      }
    })
    const messageType = computed(() => {
      return props.messageData.getType()
    })
    const messageText = computed(() => {
      return props.messageData as MessageText
    })
    const messageFile = computed(() => {
      return props.messageData as MessageFile
    })

    return {
      messageClass,
      messageType,
      MessageType,
      messageText,
      messageFile
    }
  }
})
</script>
