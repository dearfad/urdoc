<template>
  <div class="d-flex flex-column w-100 w-md-75 mx-auto align-center pt-4 ga-4">
    <div class="text-h2 font-weight-bold text-blue">URDOC</div>
    <div class="text-h4 font-weight-bold">
      {{ $t('index.title') }}
    </div>
    <div class="d-flex w-100 justify-center">
      <v-img max-width="640" src="/heroimage.png" />
    </div>
    <div class="text-h6 text-center px-4">
      <p>{{ $t('index.intro-line-1') }}</p>
      <p class="font-weight-bold">{{ $t('index.intro-line-2') }}</p>
      <p class="font-weight-bold">{{ $t('index.intro-line-3') }}</p>
      <p>{{ $t('index.intro-line-4') }}</p>
    </div>
    <v-btn
      class="font-weight-bold my-8"
      size="x-large"
      :to="$localePath('/project/narrative-medicine')"
      rounded="lg"
      variant="outlined"
    >
      {{ $t('index.button-narrative-medicine') }}
    </v-btn>
  </div>
</template>
