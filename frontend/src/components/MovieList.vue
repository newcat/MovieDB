<template>
    <v-data-table
        :headers="headerDefinitions"
        :items="movies"
        :disable-initial-sort="true"
        :loading="loading"
    >
        <template slot="items" slot-scope="props">
            <td>{{ props.item.movie_id }}</td>
            <td><a href="javascript:void(0)" @click="onMovieClick(props.item.movie_id)">{{ props.item.title }}</a></td>
            <td>{{ Object.keys(props.item.genre).join(", ") }}</td>
        </template>
        <template slot="no-data">
            <v-alert type="info" value="true" class="mt-3 mb-3">
                No items match your search criteria.
            </v-alert>
        </template>
    </v-data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IMovie } from "../interfaces/IMovie";

@Component
export default class MovieList extends Vue {

    public headerDefinitions = [
        {
            text: "ID",
            value: "movie_id",
            sortable: true
        },
        {
            text: "Title",
            value: "title",
            sortable: true
        },
        {
            text: "Genres",
            value: "genres",
            sortable: false
        }
    ];

    @Prop()
    public movies!: IMovie[];

    @Prop()
    public loading!: boolean;

    onMovieClick(movie_id: string) {
        this.$router.push({
            name: "movie",
            params: { id: movie_id }
        });
    }

}
</script>

<style>

</style>
