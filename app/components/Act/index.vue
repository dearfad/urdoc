<template>
  <div class="flex flex-col gap-2 md:flex-row">
    <UCard
      id="component-act-index"
      :ui="{
        root: 'border border-default overflow-auto flex min-h-0 flex-1 flex-col',
        header: 'bg-elevated flex items-center py-2',
        body: 'py-0 sm:py-2 flex-1 flex flex-col min-h-0 overflow-y-auto',
      }"
      class="w-full md:flex-2"
    >
      <template #header>
        <UButton icon="i-mdi-alpha-a-circle" variant="ghost" to="/cstar/act" />
        <span class="font-bold">互动实践</span>
        <div class="ms-auto flex items-center gap-2">
          <UPopover v-model:open="isMenuOpen" :dismissible="true" class="md:hidden" :ui="{ content: 'bg-default shadow-2xl rounded-xl ring border border-default' }">
            <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" size="sm" />
            <template #content>
              <div class="flex flex-col gap-1 p-1" @click="isMenuOpen = false">
                <UButton
                  :icon="settingsVisible ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
                  variant="ghost"
                  @click="$emit('toggleSettings')"
                >
                  {{ settingsVisible ? '关闭' : '设定' }}
                </UButton>
                <ButtonCapture capture-id="component-act-index" label="截屏" />
                <ButtonAudio :text="dialogueText" label="朗读" />
              </div>
            </template>
          </UPopover>
          <div class="hidden md:flex items-center gap-2">
            <UTooltip :text="settingsVisible ? '关闭' : '设定'">
              <UButton
                :icon="settingsVisible ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
                variant="ghost"
                :color="settingsVisible ? 'neutral' : 'default'"
                @click="$emit('toggleSettings')"
              />
            </UTooltip>
            <ButtonCapture capture-id="component-act-index" />
            <ButtonAudio :text="dialogueText" />
          </div>
        </div>
      </template>

      <template #default>
        <ClientOnly>
          <div
            v-if="!caseStore.case.content"
            class="text-muted flex min-h-[400px] items-center justify-center"
          >
            请先生成病例
          </div>
          <template v-else>
            <template v-if="phase === 'chatting' || phase === 'generating-quiz'">
              <UChatPalette
                :ui="{
                  root: 'flex flex-col min-h-0 flex-1',
                  content: 'flex-1 min-h-0 overflow-auto',
                }"
                :class="{ 'opacity-70': phase !== 'chatting' }"
              >
                <UChatMessages
                  :messages="chatMessages"
                  :status="chat.status"
                  :user="{ side: 'right', variant: 'soft' }"
                  :assistant="{ side: 'left', variant: 'naked' }"
                >
                  <template #indicator>
                    <div class="flex items-center gap-2 px-3 py-2 text-sm">
                      <UIcon name="i-lucide-loader-2" class="animate-spin" />
                      <span>患者正在思考...</span>
                    </div>
                  </template>
                </UChatMessages>
                <template #prompt>
                  <div v-if="phase === 'chatting'" class="flex items-center gap-2 p-2">
                    <UChatPrompt
                      v-model="userInput"
                      placeholder="请输入您的问题..."
                      :disabled="!caseStore.case.content || chat.status === 'streaming' || consultationEnded"
                      class="flex-1"
                      @submit="sendMessage"
                    />
                    <UChatPromptSubmit
                      :status="chat.status"
                      streaming-color="success"
                      @click="sendMessage"
                      @stop="chat.stop()"
                      @reload="chat.regenerate()"
                    />
                    <UButton
                      color="error"
                      variant="soft"
                      icon="i-lucide-circle-stop"
                      @click="endConsultation"
                    >
                      结束问诊
                    </UButton>
                  </div>
                  <div v-else-if="phase === 'generating-quiz'" class="flex items-center justify-center gap-2 p-4 text-sm">
                    <UIcon name="i-lucide-loader-2" class="animate-spin" />
                    <span>正在生成考题...</span>
                  </div>
                </template>
              </UChatPalette>
            </template>
            <ActQuiz
              v-else-if="phase === 'answering' || phase === 'submitted'"
              :phase="phase"
              :quiz-loading="quizLoading"
              @submit="handleSubmitQuiz"
              @regenerate="regenerateQuiz"
              @reset="resetConsultation"
            />
          </template>
        </ClientOnly>
      </template>
    </UCard>
  </div>
</template>

<script setup>
defineProps({
  settingsVisible: { type: Boolean, default: true },
})
defineEmits(['toggleSettings'])
const isMenuOpen = ref(false)
import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { getPrompt } from '~/utils/prompts'
import { safeParseJson } from '~/utils/json'

const caseStore = useCaseStore()
const storyStore = useStoryStore()
const actStore = useActStore()
const stateStore = useStateStore()
const modelStore = useModelStore()
const promptStore = usePromptStore()

const userInput = ref('')
const consultationEnded = ref(false)
const phase = ref('chatting')
const quizLoading = ref(false)

const chat = shallowRef(
  new Chat({
    transport: new DefaultChatTransport({
      api: stateStore.apiBaseUrl,
      body: {
        type: 'act',
        task: 'prompt',
      },
    }),
  }),
)

const quizChat = shallowRef(
  new Chat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  }),
)

const chatMessages = computed(() => {
  return actStore.act.content.map((msg, idx) => {
    const hasContent = msg.content && msg.content.trim().length > 0
    return {
      id: `msg-${idx}`,
      role: msg.role,
      content: msg.content,
      parts: hasContent ? [{ type: 'text', text: msg.content }] : [],
    }
  })
})

const dialogueText = computed(() => {
  return actStore.act.content
    .filter((m) => m.content)
    .map((m) => {
      const role = m.role === 'user' ? '医生' : '患者'
      return `${role}：${m.content}`
    })
    .join('\n')
})

async function buildSystemPrompt() {
  let prompt = await getPrompt('act', 'prompt')
  if (caseStore.case.content) {
    prompt += `\n\n## 病例内容\n${JSON.stringify(caseStore.case.content)}`
  }
  if (storyStore.story.content) {
    prompt += `\n\n## 背景故事\n${storyStore.story.content}`
  }
  return prompt
}

async function sendMessage() {
  if (!userInput.value.trim() || !caseStore.case.content || chat.value.status === 'streaming' || phase.value !== 'chatting') return
  const text = userInput.value
  userInput.value = ''
  actStore.act.content.push({ role: 'user', content: text })
  actStore.act.content.push({ role: 'assistant', content: '' })
  const model = modelStore.activeModels.chat
  const reasoning = stateStore.act?.reasoning ?? false
  chat.value.sendMessage(
    { text },
    {
      body: {
        model,
        reasoning,
        system: await buildSystemPrompt(),
        providerOptions: useProviderStore().getProviderOptions(model?.provider, reasoning),
      },
    },
  )
}

watch(
  () => chat.value?.lastMessage?.parts,
  (parts) => {
    if (!parts) return
    for (const part of parts.slice(1)) {
      if (isReasoningUIPart(part)) actStore.act.reasoning = part.text
      if (isTextUIPart(part)) {
        if (part.text && part.text.trim().length > 0) {
          const lastMsg = actStore.act.content[actStore.act.content.length - 1]
          if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.content = part.text
          }
        }
      }
    }
  },
  { deep: true },
)

watch(
  () => chat.value?.status,
  (status) => {
    if (status === 'error') {
      const lastMsg = actStore.act.content[actStore.act.content.length - 1]
      if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
        actStore.act.content.pop()
      }
    }
  },
)

async function endConsultation() {
  consultationEnded.value = true
  chat.value.stop()

  if (actStore.act.quiz && actStore.act.quiz.length > 0) {
    actStore.act.userAnswers = {}
    actStore.act.quizSubmitted = false
    actStore.act.quizScore = null
    phase.value = 'answering'
    return
  }

  phase.value = 'generating-quiz'

  const conversationText = actStore.act.content
    .filter((m) => m.content)
    .map((m) => {
      const role = m.role === 'user' ? '医生' : '患者'
      return `${role}：${m.content}`
    })
    .join('\n')

  let context = `病例内容：${JSON.stringify(caseStore.case.content)}`
  if (storyStore.story.content) {
    context += `\n\n背景故事：${storyStore.story.content}`
  }
  context += `\n\n问诊对话：\n${conversationText}`

  const model = modelStore.activeModels.chat
  const reasoning = stateStore.act?.reasoning ?? false
  quizChat.value.sendMessage(
    { text: context },
    {
      body: {
        model,
        type: 'act',
        task: 'end',
        system: await promptStore.getEffectivePrompt('act', 'end'),
        providerOptions: useProviderStore().getProviderOptions(model?.provider, reasoning),
      },
    },
  )
}

async function regenerateQuiz() {
  if (quizLoading.value) return
  quizLoading.value = true
  actStore.act.quiz = null
  actStore.act.userAnswers = {}
  actStore.act.quizSubmitted = false
  actStore.act.quizScore = null
  phase.value = 'generating-quiz'

  const conversationText = actStore.act.content
    .filter((m) => m.content)
    .map((m) => {
      const role = m.role === 'user' ? '医生' : '患者'
      return `${role}：${m.content}`
    })
    .join('\n')

  let context = `病例内容：${JSON.stringify(caseStore.case.content)}`
  if (storyStore.story.content) {
    context += `\n\n背景故事：${storyStore.story.content}`
  }
  context += `\n\n问诊对话：\n${conversationText}`

  const model = modelStore.activeModels.chat
  const reasoning = stateStore.act?.reasoning ?? false
  quizChat.value.sendMessage(
    { text: context },
    {
      body: {
        model,
        type: 'act',
        task: 'end',
        system: await promptStore.getEffectivePrompt('act', 'end'),
        providerOptions: useProviderStore().getProviderOptions(model?.provider, reasoning),
      },
    },
  )
}

watch(
  () => quizChat.value?.status,
  (status) => {
    if (phase.value !== 'generating-quiz') return
    quizLoading.value = false
    if (status === 'ready') {
      const parts = quizChat.value?.lastMessage?.parts
      if (!parts) return
      const text = parts
        .filter((p) => isTextUIPart(p))
        .map((p) => p.text)
        .join('')
      if (!text.trim()) return
      try {
        const parsed = safeParseJson(text)
        if (parsed && typeof parsed === 'object') {
          const quiz = Object.entries(parsed)
            .filter((entry) => {
              const v = entry[1]
              return v && v.问题 && v.选项 && v.答案
            })
            .map((entry) => {
              const v = entry[1]
              return {
                question: v.问题,
                options: v.选项,
                answer: v.答案,
              }
            })
          if (quiz.length > 0) {
            actStore.act.quiz = quiz
            actStore.act.userAnswers = {}
            actStore.act.quizSubmitted = false
            actStore.act.quizScore = null
            phase.value = 'answering'
          }
        }
      } catch (e) {
        console.error('解析考题 JSON 失败:', e)
      }
    } else if (status === 'error') {
      phase.value = 'chatting'
      consultationEnded.value = false
    }
  },
)

function handleSubmitQuiz() {
  actStore.submitQuiz()
  phase.value = 'submitted'
}

function resetConsultation() {
  consultationEnded.value = false
  phase.value = 'chatting'
  actStore.reset()
  chat.value = new Chat({
    transport: new DefaultChatTransport({
      api: stateStore.apiBaseUrl,
      body: {
        type: 'act',
        task: 'prompt',
      },
    }),
  })
  quizChat.value = new Chat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })
}
</script>
