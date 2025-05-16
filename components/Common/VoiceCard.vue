<template>
  <v-card hover class="px-4" rounded="lg">
    <v-switch
      v-model="stateStore.isVoice"
      label="语音"
      color="primary"
      hide-details
      @change="handleChange"
    />
    <v-slider
      v-model="stateStore.voiceId"
      :max="14"
      :min="1"
      show-ticks="always"
      step="1"
      tick-size="4"
    />
    {{ stateStore.voiceId }}
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

function handleChange() {
  recordStore.record.voice = ''
}
</script>
