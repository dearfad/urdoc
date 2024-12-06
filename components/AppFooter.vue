<template>
    <v-footer app>
        <v-sheet class="mx-auto text-caption">
            {{ new Date().getFullYear() }} - 虚拟病例研究所 - Ver 0.0.1 -
            <span class="font-weight-bold">{{ user ? user.email.split('@')[0] : '访客' }}</span>
        </v-sheet>
    </v-footer>
</template>

<script setup>
const user = useSupabaseUser()
</script>
