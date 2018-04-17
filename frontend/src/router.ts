import Vue from "vue";
import Router from "vue-router";
import Movie from "./views/Movie.vue";
import Search from "./views/Search.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "search",
      component: Search
    },
    {
      path: "/movie/:id",
      name: "movie",
      component: Movie
    },
    {
      path: "/actor/:id",
      name: "actordetail",
      component: undefined // todo
    }
  ]
});
