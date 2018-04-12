<template>
    <v-card>
        <v-card-title>{{ movie.title }}</v-card-title>
        <v-card-text>{{ movie.genres }}</v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IMovie } from "../interfaces/IMovie";

@Component
export default class Movie extends Vue {

    @Prop()
    public movieData: IMovie

}
</script>

<style>

</style>
