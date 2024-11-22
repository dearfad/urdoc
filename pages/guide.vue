<template>
    <v-stepper alt-labels editable>
        <v-stepper-header>
            <v-stepper-item title="生成" value="1" />
            <v-divider />
            <v-stepper-item title="模拟" value="2" />
            <v-divider />
            <v-stepper-item title="编写" value="3" />
            <v-divider />
            <v-stepper-item title="设计" value="4" />
            <v-divider />
            <v-stepper-item title="评估" value="5" />
        </v-stepper-header>
        <v-stepper-window>
            <v-stepper-window-item value="1">
                <v-card title="Step One" flat>...</v-card>
            </v-stepper-window-item>
            <v-stepper-window-item value="2">
                <v-card title="Step One" flat>...</v-card>
            </v-stepper-window-item>
            <v-stepper-window-item value="3">
                <v-card title="Step One" flat>...</v-card>
            </v-stepper-window-item>
            <v-stepper-window-item value="4">
                <v-card title="Step One" flat>...</v-card>
            </v-stepper-window-item>
            <v-stepper-window-item value="5">
                <v-card title="Step One" flat>...</v-card>
            </v-stepper-window-item>
        </v-stepper-window>

        <!-- <template #item.2>
            <v-card title="Step Two" flat>...</v-card>
        </template>

        <template #item.3>
            <v-card title="Step Three" flat>...</v-card>
        </template>
        <template #item.4>
            <v-card title="Step 4" flat>...</v-card>
        </template>
        <template #item.5>
            <v-card title="Step 5" flat>...</v-card>
        </template> -->
    </v-stepper>
</template>
