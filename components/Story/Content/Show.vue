<template>
  <v-sheet class="text-body-1 pa-4 mx-4 my-2" elevation="4" rounded="lg" min-height="60vh">
    <div v-if="!caseStore.caseStoryMarkdown" class="pa-4">
      {{ stateStore.modelResponseString }}
    </div>
    <MDC :value="caseStore.caseStoryMarkdown" />
  </v-sheet>

  <!-- <v-sheet>
        <ClientOnly>
            <v-textarea v-model="caseStore.caseStory" auto-grow variant="outlined" />
            <v-sheet class="my-2">
                <v-chip variant="text" class="px-1">标签:</v-chip>
                <span v-if="caseStore.storyTag != ''">
                    <v-chip
                        v-for="keyPoint in caseStore.storyTag.split(' ')"
                        :key="keyPoint"
                        variant="outlined"
                        class="ma-1"
                    >
                        {{ keyPoint }}
                    </v-chip>
                </span>
            </v-sheet>
        </ClientOnly>
    </v-sheet> -->
</template>

<script setup>
const stateStore = useStateStore()
const caseStore = useCaseStore()
</script>
