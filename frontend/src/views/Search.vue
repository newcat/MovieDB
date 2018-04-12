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
    </v-container>

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Search extends Vue {
  public searchMovies = false;
  public searchActors = false;

  public searchOptions = [
    "ILIKE",
    "RegEx",
    "Levenshtein",
    "Trigram",
    "Fulltext",
    "Metaphone",
    "Fuse"
  ];
  public selectedSearchOptions = [];

  public searchQuery = "";
}
</script>

<style>

</style>
