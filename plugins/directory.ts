export default defineNuxtPlugin(() => {
  return {
    provide: {
      dirname: () => __dirname
    }
  }
})
