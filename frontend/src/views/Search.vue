<template>
    <v-container align-content-center>

        <v-layout row justify-space-around>
            <v-flex xs12 md6 xl4>
                <v-card>
                    <v-card-text>
                        <v-container fluid>

                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field name="search" label="Search" v-model="searchQuery" />
                                </v-flex>
                            </v-layout>
                        
                            <v-layout row wrap>
                                <v-flex xs12>Search on</v-flex>
                                <v-flex xs12 sm6 lg4>
                                    <v-checkbox label="Movies" v-model="searchMovies"></v-checkbox>
                                </v-flex>
                                <v-flex xs12 sm6 lg4>
                                    <v-checkbox label="Actors" v-model="searchActors"></v-checkbox>
                                </v-flex>
                            </v-layout>

                            <v-layout row wrap>
                                <v-flex xs12>Text matching:</v-flex>
                                <v-flex v-for="option in searchOptions" :key="option" xs12 sm6 lg4>
                                    <v-checkbox :label="option" :value="option" v-model="selectedSearchOptions"></v-checkbox>
                                </v-flex>
                            </v-layout>

                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>

        <v-layout row justify-space-around class="mt-3">
            <v-flex xs12 lg8>
                <movie-list :movies="movies" :loading="loading"></movie-list>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import MovieList from "@/components/MovieList.vue";
import Request from "../request";

@Component({
    components: {
        MovieList
    }
})
export default class Search extends Vue {

    public readonly searchOptions = [
        "ILIKE",
        "RegEx",
        "Levenshtein",
        "Trigram",
        "Fulltext",
        "Metaphone",
        "Fuse"
    ];

    public searchMovies = true;
    public searchActors = false;    
    public selectedSearchOptions = ["Metaphone"];
    public searchQuery = "";

    public movies = [];
    public loading = false;

    @Watch('searchMovies')
    @Watch('searchActors')
    @Watch('selectedSearchOptions')
    @Watch('searchQuery')
    private async search() {

        this.loading = true;
        
        try {
            const res = await Request.get("/movies", {
                params: {
                    options: this.selectedSearchOptions.join(),
                    q: this.searchQuery,
                    bytitle: this.searchMovies,
                    byactor: this.searchActors
                }
            });
            this.movies = res.data;
        } catch(e) {
            console.log(e);
        }

        this.loading = false;

    }

}
</script>

<style>

</style>
