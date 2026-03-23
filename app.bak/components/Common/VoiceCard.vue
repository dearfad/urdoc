<template>
  <v-card hover class="px-4 my-3" rounded="lg">
    <v-switch v-model="stateStore.isVoice" label="语音" color="primary" hide-details />
    <v-select
      v-model="stateStore.voiceId"
      label="声音选择"
      :items="voiceId"
      item-title="description"
      item-value="id"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
    />
    <div v-if="stateStore.isVoice">
      <audio v-if="recordStore.record.voice" autoplay controls class="w-100 my-2">
        <source :src="recordStore.record.voice" type="audio/mpeg" />
      </audio>
    </div>
  </v-card>
</template>

<script setup>
const stateStore = useStateStore()
const recordStore = useRecordStore()
const voiceId = [
  { description: '朗读者1 - 女声 - 中文（中国大陆）', id: 1 },
  { description: '朗读者2 - 女声 - 中文（中国大陆）', id: 2 },
  { description: '朗读者3 - 男声 - 中文（中国大陆）', id: 3 },
  { description: '朗读者4 - 男声 - 中文（中国大陆）', id: 4 },
  { description: '朗读者5 - 男声 - 中文（中国大陆）', id: 5 },
  { description: '朗读者6 - 男声 - 中文（中国大陆）', id: 6 },
  { description: '朗读者7 - 女声 - 中文（东北普通话）', id: 7 },
  { description: '朗读者8 - 女声 - 中文（中原普通话陕西）', id: 8 },
  { description: '朗读者9 - 女声 - 中文（粤语传统）', id: 9 },
  { description: '朗读者10 - 女声 - 中文（香港）', id: 10 },
  { description: '朗读者11 - 男声 - 中文（香港）', id: 11 },
  { description: '朗读者12 - 女声 - 中文（台湾）', id: 12 },
  { description: '朗读者13 - 男声 - 中文（台湾）', id: 13 },
  { description: '朗读者14 - 女声 - 中文（台湾普通话）', id: 14 },
]
</script>
