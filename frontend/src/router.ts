import Vue from "vue";
import Router from "vue-router";
import Movies from "./views/Movies.vue";
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
      name: "moviedetail",
      component: undefined // todo
    },
    {
      path: "/actor/:id",
      name: "actordetail",
      component: undefined // todo
    }
  ]
});
