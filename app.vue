<template>
  <div class="app-container">
    <div class="tools">
      <button class="add-btn" @click="textDialog.show">
        +
      </button>
    </div>
    <main class="content">
      <MessageBase v-for="message in messages" :key="message.contentCommon.guid" :message-data="message" />
    </main>
    <DialogText ref="textDialog" @submitText="onSubmitText" />
    <FileDrop v-if="isDragging" @dragleave="onDragExit" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DialogText, FileDrop } from './.nuxt/components'
import { MessageText, Message } from './types/Message'
import { Request } from './utils/ApiRequest'

export default defineComponent({
  components: {
    DialogText, FileDrop
  },
  setup () {
    const textDialog = ref<InstanceType<typeof DialogText>>()
    const route = useRoute()
    const messages = ref<Array<Message>>([])
    const isDragging = ref<boolean>(false)

    const onSubmitText = async (text: string) => {
      const message = new MessageText({
        url: route.path,
        text
      })
      console.log(message)
      await Request.uploadMessage([message])
      await nextTick()
      await fetchMessages()
    }

    const fetchMessages = async () => {
      const response = await Request.getMessages(route.path)
      const objects = response.data as Array<any>

      messages.value = []
      for (const obj of objects) {
        messages.value.push(Message.objectToMessage(obj))
      }
    }

    const onDragEnter = (_e: DragEvent) => {
      isDragging.value = true
    }
    const onDragExit = (_e: DragEvent) => {
      isDragging.value = false
    }

    onMounted(() => {
      fetchMessages()

      window.addEventListener('dragover', onDragEnter)
      window.addEventListener('dragend', onDragExit)
      window.addEventListener('drop', onDragExit)
    })

    return {
      textDialog,
      messages,
      onSubmitText,
      isDragging,
      onDragExit
    }
  }
})
</script>

<style lang="scss">
@import "~~/assets/variables.scss";
</style>

<style lang="scss" scoped>
div.app-container {
  display: flex;

  main.content {
    width: 100%;
    max-width: 960px;
    height: 100%;
    margin: 0 auto;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #cccccc;
    flex-grow: 1;
  }
}
div.tools {
  display: flex;
  flex-direction: column-reverse;
  position: fixed;
  right: 0;
  width: fit-content;
  height: 100%;
  padding: 1rem;

  button.add-btn {
    background-color: red;
    border-radius: 9999px;
    width: 3.5rem;
    aspect-ratio: 1;
    text-align: center;
  }
}
</style>
