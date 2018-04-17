<template>
    <v-data-table
        :headers="headerDefinitions"
        :items="actors"
        :disable-initial-sort="true"
        :loading="loading"
    >
        <template slot="items" slot-scope="props">
            <td>{{ props.item.actor_id }}</td>
            <td>{{ props.item.name }}</td>
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
            value: "actor_id",
            sortable: true
        },
        {
            text: "Name",
            value: "name",
            sortable: true
        }
    ];

    @Prop()
    public actors!: any[];

    @Prop()
    public loading!: boolean;

}
</script>

<style>

</style>
