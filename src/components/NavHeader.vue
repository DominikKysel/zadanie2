<script setup>
</script>
<template>
    <main>
        <v-app-bar app>
            <v-toolbar-title>Zadanie 2</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text to="/">Rozvrh</v-btn>
            <v-btn text to="/works">Záverečné práce</v-btn>
        </v-app-bar>
        <v-container>
            <slot></slot>
        </v-container>
    </main>
</template>
<style scoped>
</style>