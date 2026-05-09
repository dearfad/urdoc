<template>
  <div>
    <UTooltip text="主题">
      <UColorModeButton />
    </UTooltip>
    <UTooltip text="文档">
      <UButton
        to="https://docs.urdoc.dearfad.com"
        target="_blank"
        icon="i-lucide-file-text"
        aria-label="Documentation"
        color="neutral"
        variant="ghost"
      />
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
      <SignInButton mode="modal">
        <UButton icon="i-mdi-account-lock-open" variant="ghost" color="neutral" />
      </SignInButton>
    </Show>
    <Show when="signed-in">
      <UserButton
        :appearance="{
          elements: { userButtonAvatarBox: { width: '20px', height: '20px', margin: '6px' } },
        }"
      />
    </Show>
  </div>
</template>
