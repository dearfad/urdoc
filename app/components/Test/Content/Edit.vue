<template>
  <v-sheet class="text-body-1 mx-4 overflow-auto" elevation="4" rounded="lg" height="55vh">
    <v-list variant="plain">
      <v-list-item
        v-for="(item, index) in recordStore.record.test"
        :key="index"
        :value="item"
        :ripple="false"
      >
        <v-textarea
          v-model="item['问题']"
          class="my-2 font-weight-bold"
          rows="1"
          auto-grow
          :label="'问题 ' + (index + 1)"
          variant="outlined"
          hide-details="auto"
        />
        <v-list>
          <v-list-item
            v-for="(option, i) in Object.keys(item['选项'])"
            :key="i"
            :value="option"
            :ripple="false"
          >
            <v-textarea
              v-model="item['选项'][option]"
              class="my-2"
              rows="1"
              auto-grow
              :label="option"
              variant="outlined"
              hide-details="auto"
            />
          </v-list-item>
        </v-list>
        <v-textarea
          v-model="item['答案']"
          class="my-2"
          rows="1"
          auto-grow
          label="答案"
          variant="outlined"
          hide-details="auto"
        />
        <v-divider :thickness="4" class="border-opacity-50 mb-4 mt-6" />
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<script setup>
const recordStore = useRecordStore()
</script>
