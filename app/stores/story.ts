const VERSION = '2026-05-06'

export const useStoryStore = defineStore('story', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:story')

  const story = ref<Story>({
    id: 0,
    tags: [],
    custom: [],
    reasoning: null,
    content: null,
  })

  function reset() {
    story.value = {
      id: 0,
      tags: [],
      custom: [],
      reasoning: null,
      content: null,
    }
  }

  function generate() {}
  function verify() {}

  function comment() {}

  function converse() {}

  function discuss() {}

  function illustrate() {}

  return { version, story, reset, generate, verify, comment, conversation: converse, discussion: discuss, illustrate }
})
