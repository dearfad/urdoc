<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <CommonCurrentPatient />
                <CommonCurrentPatientNotExist />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" order="2" md="9" order-md="1"><SimShowChatMessages /></v-col>
            <v-col cols="12" order="1" md="3" order-md="2">
                <SimSendMessage />
            </v-col>
        </v-row>
    </v-container>
</template>
