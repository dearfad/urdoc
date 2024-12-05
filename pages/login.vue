<template>
    <v-sheet class="d-flex flex-column">
        <v-text-field v-model="email" label="邮箱" variant="outlined" class="w-50 mx-auto" />
        <v-text-field v-model="password" label="密码" variant="outlined" class="w-50 mx-auto" />
        <v-btn class="w-25 mx-auto" size="large" @click="signInWithPassword">登录</v-btn>
        <v-btn class="w-25 mx-auto" size="large" @click="signUpNewUser">注册</v-btn>
        <v-btn class="w-25 mx-auto" size="large" @click="signOut">退出</v-btn>
        <v-btn class="w-25 mx-auto" size="large" @click="signInAnonymously">匿名登录</v-btn>
        <v-snackbar v-model="snackBar" timeout="2000">{{ snackBarText }}</v-snackbar>
        <v-sheet>{{ user }}</v-sheet>
    </v-sheet>
</template>

<script setup>
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const snackBar = ref(false)
const snackBarText = ref('')

const user = useSupabaseUser()

const signInWithPassword = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    })
    console.log(data, error)
    if (error) {
        snackBarText.value = error
        snackBar.value = true
        console.log(error)
    }
}

const signUpNewUser = async () => {
    const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
    })
    console.log(data, error)
    if (error) {
        snackBarText.value = error
        snackBar.value = true
        console.log(error)
    }
}

const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    console.log(error)
    if (error) {
        snackBarText.value = error
        snackBar.value = true
        console.log(error)
    }
}

const signInAnonymously = async () => {
    const { data, error } = await supabase.auth.signInAnonymously()
    console.log(data, error)
    if (error) {
        snackBarText.value = error
        snackBar.value = true
        console.log(error)
    }
}
</script>
