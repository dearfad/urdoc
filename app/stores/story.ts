const VERSION = '2026-05-03'

const storyDefault = {
  id: 0,
  tags: [],
  custom: [],
  reasoning: null,
  content: null,
}

export const useStoryStore = defineStore('story', () => {
  const version = ref(VERSION)

  const story = ref<Story>({ ...storyDefault })

  function reset() {
    story.value = { ...storyDefault }
  }

  syncStoreVersion(VERSION, 'pinia:story')
  return { version, story, reset }
})
