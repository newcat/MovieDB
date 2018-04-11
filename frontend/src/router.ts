import Vue from "vue";
import Router from "vue-router";
import Movies from "./views/Movies.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "movies",
      component: Movies
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
