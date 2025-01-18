<template>
    <v-sheet min-height="20" class="text-left">
        <v-list class="chatMsgContainer flex-grow-1">
            <ClientOnly>
                <v-list-item
                    v-for="(message, index) in caseStore.rateMessages.slice(1)"
                    :key="index"
                    :title="
                        message.role == 'user' ? '医生：' : caseStore.caseContent['姓名'] + '：'
                    "
                >
                    <span class="font-weight-bold">{{ message.content }}</span>
                </v-list-item>
                <v-list-item class="chatMsgBottom" />
            </ClientOnly>
        </v-list>
    </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
// const goTo = useGoTo()

// 聊天信息更新后自动滚动
// messageStore.$subscribe(() => {
//     nextTick(() => {
//         goTo('.chatMsgBottom', { container: '.chatMsgContainer' })
//     })
// })

// 手机输入法遮挡滚动
// const stateStore = useStateStore()
// watch(
//     () => stateStore.isInputFocused,
//     () => {
//         setTimeout(() => {
//             goTo('.chatMsgBottom', { container: '.chatMsgContainer' })
//         }, 300)
//     }
// )
</script>
