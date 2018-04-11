<template>
    <v-app>

        <v-toolbar color="indigo" dark fixed app>
            <v-toolbar-title>MovieDB</v-toolbar-title>
            <v-text-field
                flat
                solo-inverted
                prepend-icon="search"
                label="Search"
                class="hidden-sm-and-down ml-3"
            ></v-text-field>
            <v-select
                :items="searchOptions"
                v-model="selectedSearchOption"
                label="Select"
                class="ml-3"
                style="max-width: 200px;"
                solo-inverted
            ></v-select>
            <v-spacer></v-spacer>
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
export default class App extends Vue {

    public searchOptions = [ "Movie", "Actor", "Movie (Client)" ];
    public selectedSearchOption = "";

}
</script>


<style>

</style>
