<template>
  <div>
    <UTooltip text="主题">
      <UColorModeButton />
    </UTooltip>
    <UTooltip text="文档">
      <UButton to="/docs" icon="i-lucide-file-text" aria-label="Documentation" color="neutral" variant="ghost" />
    </UTooltip>
    <UTooltip text="GitHub">
      <UButton
        to="https://github.com/dearfad/urdoc"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
    </UTooltip>
    <Show when="signed-out">
      <UTooltip text="登录">
        <UButton icon="i-lucide-log-in" aria-label="Sign in" color="neutral" variant="ghost" @click="clerk.openSignIn()" />
      </UTooltip>
    </Show>
    <Show when="signed-in">
      <UTooltip text="账户">
        <UButton icon="i-lucide-user" aria-label="Profile" color="neutral" variant="ghost" @click="clerk.openUserProfile()" />
      </UTooltip>
      <UTooltip text="退出">
        <UButton icon="i-lucide-log-out" aria-label="Sign out" color="neutral" variant="ghost" @click="clerk.signOut()" />
      </UTooltip>
    </Show>
  </div>
</template>

<script setup lang="ts">
const clerk = useClerk().value!
</script>
