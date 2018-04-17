<template>
    
    <v-container grid-list-md>
        <v-alert type="error" v-if="error">
            Failed to load movie
        </v-alert>

        <v-layout v-if="!error && movie" row wrap fill-height>

            <v-flex xs12>
                <h1 class="text-xs-center mt-3 mb-3">{{ movie.title }}</h1>
            </v-flex>

            <!-- actors -->
            <v-flex xs12 md6 lg4>
                <v-card style="height: 100%;">
                    <v-card-title primary-title>
                        <h3 class="headline text-xs-center" style="width: 100%;">Actors</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-tile v-for="actor in movie.actors" :key="actor.actor_id" @click="() => {}">
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="actor.name"></v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-flex>

            <!-- genres -->
            <v-flex xs12 md6 lg4>
                <v-card style="height: 100%;">
                    <v-card-title primary-title>
                        <h3 class="headline text-xs-center" style="width: 100%;">Genres</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row v-for="genre in genres" :key="genre.name">
                            <v-flex xs6>{{ genre.name }}</v-flex>
                            <v-flex xs6>
                                <v-progress-linear :value="genre.value"></v-progress-linear>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>

            <!-- similar movies -->
            <v-flex xs12 md6 lg4>
                <v-card style="height: 100%;">
                    <v-card-title primary-title>
                        <h3 class="headline text-xs-center" style="width: 100%;">Similar Movies</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-tile v-for="m in movie.similar" :key="m.movie_id" @click="navigateMovie(m.movie_id)">
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="m.title"></v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-flex>

        </v-layout>
        
    </v-container>

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Request from "../request";

@Component
export default class Movies extends Vue {

    public error = false;
    public movie = null;

    public get genres() {
        if (!this.movie) return [];

        const keys = Object.keys(this.movie.genre);

        // calc max value
        let max = 0;
        keys.forEach(k => {
            if (this.movie.genre[k] > max) { max = this.movie.genre[k]; }
        });

        const ret = [];
        Object.keys(this.movie.genre).forEach(g => {
            ret.push({
                name: g,
                value: 100 * this.movie.genre[g] / max
            });
        });
        return ret;
    }

    public navigateMovie(movie_id: string) {
        this.$router.push({
            name: "movie",
            params: { id: movie_id }
        });
    }

    @Watch("$route")
    public onRouteUpdate() {
        this.load();
    }

    private async load() {
        try {
            this.movie = (await Request.get(`/movies/${this.$router.currentRoute.params.id}`)).data;
        } catch (err) {
            this.error = true;
        }
    }

    mounted() {        
        this.load();
    }

}
</script>

<style>

</style>
