<template>
    <v-app>

        <v-toolbar color="indigo" dark fixed app>
            <v-toolbar-title @click="$router.push({name:'search'})" style="cursor: pointer;">MovieDB</v-toolbar-title>
        </v-toolbar>

        <v-content>
            <router-view/>
        </v-content>

    </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>

<style>

</style>
