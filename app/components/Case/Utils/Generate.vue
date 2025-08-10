<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <CommonGenerateButton generate-type="case" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-row>
          <v-col>
            <CommonScopeSelector />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <CommonModelCard model-type="chat" model-usage="case" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <CommonTagInput tag-type="case" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <CommonPromptCard usage="case" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
