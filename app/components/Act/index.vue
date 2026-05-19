<template>
  <div class="flex flex-col gap-2 md:flex-row">
    <UCard
      id="component-act-index"
      :ui="{
        root: 'border border-default overflow-auto flex flex-col',
        header: 'bg-elevated flex items-center py-2',
        body: 'py-0 sm:py-2 flex-1',
        footer: 'p-0 sm:p-0',
      }"
      class="w-full md:flex-2"
    >
      <template #header>
        <UButton icon="i-mdi-alpha-a-circle" variant="ghost" to="/cstar/act" />
        <span class="font-bold">互动实践</span>
        <div class="ms-auto flex gap-2">
          <ButtonCapture capture-id="component-act-index" />
          <UButton icon="i-lucide-file-volume" variant="ghost" />
        </div>
      </template>

      <template #default>
        <ClientOnly>
          <div class="flex min-h-[400px] flex-col gap-3 p-2">
            <div v-if="!caseStore.case.content" class="text-muted py-8 text-center">请先生成病例</div>
            <template v-else>
              <div
                v-for="(msg, idx) in actStore.act.content"
                :key="idx"
                :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
              >
                <UBadge
                  :color="msg.role === 'user' ? 'primary' : 'neutral'"
                  variant="soft"
                  size="lg"
                  class="max-w-[80%] text-left"
                >
                  <span class="font-bold">{{ msg.role === 'user' ? '医生' : '患者' }}：</span>
                  {{ msg.content }}
                </UBadge>
              </div>
              <div v-if="chat.status === 'streaming'" class="flex justify-start">
                <UBadge color="neutral" variant="soft" size="lg">
                  <UIcon name="i-lucide-loader-2" class="mr-1 animate-spin" />
                  患者正在思考...
                </UBadge>
              </div>
            </template>
          </div>
        </ClientOnly>
      </template>

      <template #footer>
        <div class="mx-4 my-2 flex gap-2" v-if="actStore.act.custom && actStore.act.custom.length > 0">
          <UInput
            v-model="userInput"
            placeholder="请输入您的问题..."
            class="flex-1"
            size="lg"
            variant="soft"
            :disabled="!caseStore.case.content || chat.status === 'streaming'"
            @keyup.enter="sendMessage"
          />
          <UChatPromptSubmit
            :status="chat.status"
            @stop="chat.stop()"
            @reload="chat.regenerate()"
            @click="sendMessage"
            streaming-color="success"
          >
            发送
          </UChatPromptSubmit>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
import { DefaultChatTransport, isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'

const caseStore = useCaseStore()
const actStore = useActStore()
const stateStore = useStateStore()
const modelStore = useModelStore()

const userInput = ref('')

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: stateStore.apiBaseUrl,
    body: {
      model: modelStore.activeModels.act,
      type: 'act',
      task: 'prompt',
    },
  }),
})

function sendMessage() {
  if (!userInput.value.trim() || !caseStore.case.content || chat.status === 'streaming') return
  const text = userInput.value
  userInput.value = ''
  actStore.act.content.push({ role: 'user', content: text })
  chat.sendMessage(
    { text: text },
    {
      body: {
        reasoning: stateStore.act?.reasoning,
        case: caseStore.case.content,
      },
    },
  )
}

watch(
  () => chat.lastMessage?.parts,
  (parts) => {
    if (!parts) return
    for (const part of parts.slice(1)) {
      if (isReasoningUIPart(part)) actStore.act.reasoning = part.text
      if (isTextUIPart(part)) {
        if (part.text && part.text.trim().length > 0) {
          const lastMsg = actStore.act.content[actStore.act.content.length - 1]
          if (!lastMsg || lastMsg.role !== 'assistant') {
            actStore.act.content.push({ role: 'assistant', content: part.text })
          } else {
            lastMsg.content = part.text
          }
        }
      }
    }
  },
  { deep: true },
)
</script>
