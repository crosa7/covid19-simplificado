import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomePage from '@/components/HomePage.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
