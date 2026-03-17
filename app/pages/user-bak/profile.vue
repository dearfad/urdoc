<template>
  <v-container class="d-flex flex-column w-100 w-md-75 py-4 ga-4">
    <CommonUserCard />
    <SignedOut>
      <SignInButton />
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </v-container>
</template>
