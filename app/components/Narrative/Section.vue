<template>
  <!-- 单个区块的渲染单元：线性布局与分组布局共用，保证区块集合与数据来源完全一致 -->
  <section
    v-if="data.show[meta.key]"
    class="nm-block group relative overflow-hidden"
    :data-nm-section="meta.key"
    :style="`--nm-delay:${meta.delay}`"
  >
    <div class="nm-block-accent" />
    <NarrativeBlockCard :meta="meta">
      <CaseBlock v-if="meta.key === 'case'" :data="data" />
      <StoryBlock v-else-if="meta.key === 'story'" :data="data" />
      <ConversationBlock v-else-if="meta.key === 'conversation'" :data="data" />
      <DiscussionBlock v-else-if="meta.key === 'discussion'" :data="data" />
      <CommentBlock v-else-if="meta.key === 'comment'" :data="data" />
    </NarrativeBlockCard>
  </section>
</template>

<script setup lang="ts">
import type { NarrativeSheetData } from '~/types/narrative'
import type { NarrativeBlockMeta } from '~/utils/narrativeSections'
import NarrativeBlockCard from './BlockCard.vue'
import CaseBlock from './blocks/CaseBlock.vue'
import StoryBlock from './blocks/StoryBlock.vue'
import ConversationBlock from './blocks/ConversationBlock.vue'
import DiscussionBlock from './blocks/DiscussionBlock.vue'
import CommentBlock from './blocks/CommentBlock.vue'

defineProps<{ meta: NarrativeBlockMeta; data: NarrativeSheetData }>()
</script>
