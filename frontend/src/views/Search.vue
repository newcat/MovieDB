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
                                <v-flex xs12>Search for</v-flex>
                                <v-flex xs12>
                                    <v-radio-group v-model="searchFor" row>
                                        <v-radio label="Movies" value="movies"></v-radio>
                                        <v-radio label="Actors" value="actors"></v-radio>
                                    </v-radio-group>
                                </v-flex>
                            </v-layout>

                            <v-layout row wrap>
                                <v-flex xs12>Search on</v-flex>
                                <v-flex xs12 sm6 lg4>
                                    <v-checkbox label="Movies" v-model="searchOnMovies"></v-checkbox>
                                </v-flex>
                                <v-flex xs12 sm6 lg4>
                                    <v-checkbox label="Actors" v-model="searchOnActors"></v-checkbox>
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
                <movie-list v-if="resultType == 'movies'" :movies="results" :loading="loading"></movie-list>
                <actor-list v-if="resultType == 'actors'" :actors="results" :loading="loading"></actor-list>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import MovieList from "@/components/MovieList.vue";
import ActorList from "@/components/ActorList.vue";
import Request from "../request";

@Component({
    components: {
        MovieList,
        ActorList
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

    public searchOnMovies = true;
    public searchOnActors = false;    
    public searchFor = "movies";
    public selectedSearchOptions = ["Metaphone"];
    public searchQuery = "";

    public resultType = "movies";
    public results = [];
    public loading = false;

    @Watch('searchOnMovies')
    @Watch('searchOnActors')
    @Watch('selectedSearchOptions')
    @Watch('searchQuery')
    @Watch('searchFor')
    private async search() {

        if (this.loading) { return; }
        this.loading = true;
        
        try {
            const type = this.searchFor;
            const res = await Request.get(
                this.searchFor === "movies" ? "/movies" : "/actors", {
                params: {
                    options: this.selectedSearchOptions.join(),
                    q: this.searchQuery,
                    bytitle: this.searchOnMovies,
                    byactor: this.searchOnActors
                }
            });
            this.resultType = type;
            this.results = res.data;
        } catch(e) {
            console.log(e);
        }

        this.loading = false;

    }

}
</script>

<style>

</style>
