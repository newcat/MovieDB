<template>
    
    <v-container>
        <v-alert type="error" v-if="error">
            Failed to load movie
        </v-alert>

        <div v-if="!error && movie">
            <h1>{{ movie.title }}</h1>
            <ul>
                <li v-for="actor in movie.actors" :key="actor.actor_id">{{ actor.name }}</li>
            </ul>
        </div>
    </v-container>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Request from "../request";

@Component
export default class Movies extends Vue {

    public error = false;
    public movie = null;

    async mounted() {        
        try {
            this.movie = (await Request.get(`/movies/${this.$router.currentRoute.params.id}`)).data;
        } catch (err) {
            this.error = true;
        }
    }

}
</script>

<style>

</style>
