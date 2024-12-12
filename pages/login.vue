<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" class="mx-auto">
                <v-text-field
                    v-model="email"
                    label="邮箱"
                    variant="outlined"
                    :disabled="user ? true : false"
            /></v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6" class="mx-auto">
                <v-text-field
                    v-model="password"
                    label="密码"
                    type="password"
                    variant="outlined"
                    :disabled="user ? true : false"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="3" class="mx-auto">
                <v-btn
                    size="large"
                    block
                    :disabled="user ? true : false"
                    @click="signInWithPassword"
                    >登录</v-btn
                >
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="3" class="mx-auto">
                <v-btn size="large" block :disabled="user ? false : true" @click="signOut"
                    >退出</v-btn
                >
            </v-col>
        </v-row>
        <v-row v-if="user">
            <v-col cols="12" md="3" class="mx-auto text-center"> 当前登录：{{ user.email }} </v-col>
        </v-row>
        <!-- <v-btn class="w-25 mx-auto" size="large" @click="signUpNewUser">注册</v-btn> -->
        <!-- <v-btn class="w-25 mx-auto" size="large" @click="signInAnonymously">匿名登录</v-btn> -->
        <v-snackbar v-model="snackBar" timeout="2000"
            ><div class="text-center">{{ snackBarText }}</div></v-snackbar
        >

        <v-sheet>{{ simcases }}</v-sheet>
    </v-container>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const snackBar = ref(false)
const snackBarText = ref('')

const user = useSupabaseUser()

const { data: simcases } = await useAsyncData('simcases', async () => {
    const { data } = await supabase.from('simcases').select('*')
    return data
})

const signInWithPassword = async () => {
    const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    })
    if (error) {
        switch (error.code) {
            case 'invalid_credentials':
                snackBarText.value = '认证失败：登录凭证无效'
                break
            default:
                snackBarText.value = error
        }
        snackBar.value = true
    }
}

const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        snackBarText.value = error
        snackBar.value = true
    }
}

// const signUpNewUser = async () => {
//     const { data, error } = await supabase.auth.signUp({
//         email: email.value,
//         password: password.value,
//     })
//     console.log(data, error)
//     if (error) {
//         snackBarText.value = error
//         snackBar.value = true
//         console.log(error)
//     }
// }

// const signInAnonymously = async () => {
//     const { data, error } = await supabase.auth.signInAnonymously()
//     console.log(data, error)
//     if (error) {
//         snackBarText.value = error
//         snackBar.value = true
//         console.log(error)
//     }
// }
</script>
