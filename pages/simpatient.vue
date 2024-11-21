<template>
    <v-sheet class="d-flex flex-column overflow-auto">
        <ShowCaseInfo />
        <v-container class="flex-grow-1 h-screen">
            <v-row>
                <v-col>
                    <ShowInfo />
                </v-col>
                <v-col>
                    <ShowChatMessages />
                    <SendMessage />
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>
