<template>
  <div
    class="file-drop"
    @dragenter.prevent=""
    @dragleave.prevent=""
    @dragover.prevent=""
    @drop.prevent="onDropped"
  >
    <p class="file-drop-message">
      Drop file here.
    </p>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  setup () {
    const onDropped = (e: DragEvent) => {
      e.preventDefault()

      console.log(e.dataTransfer.files)
    }

    return {
      onDropped
    }
  }
})
</script>

<style lang="scss" scoped>
div.file-drop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #ffffff, $alpha: 0.5);

    display: flex;
    justify-content: center;
    align-items: center;

    p.file-drop-message {
      font-size: 4rem;
      margin: 0 auto;
      text-align: center;
    }
}
</style>
