import { createRouter, createWebHistory } from "vue-router";

// const auth = ({ to, from, next }) => {
//     if (to.meta.requiresAuth) {
//         if (!localStorage.getItem('access_token')) {
//             return {
//                 path: '/login',
//                 // save the location we were at to come back later
//                 // query: { redirect: to.fullPath },
//             }
//         }
//     }

//     return next()
// }

var routes = [
  {
    // will match everything
    path: "/:catchAll(.*)",
    layout: "dashboard",
    component: () => import(/* @vite-ignore */ "./pages/Errors/404/index.vue"),
    meta: {
      // layoutClass: 'default',
      requiresAuth: true,
    },
  },
  {
    path: "/",
    name: "Home",
    component: () => import(/* @vite-ignore */ "./pages/Home/index.vue"),
    layout: "dashboard",
    meta: {
      // layoutClass: 'default',
      requiresAuth: true,
    },
  },
  {
    path: "/project",
    name: "Project",
    component: () => import(/* @vite-ignore */ "./pages/Project/index.vue"),
    layout: "dashboard",
    meta: {
      // layoutClass: 'default',
      requiresAuth: true,
    },
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => import(/* @vite-ignore */ "./pages/Setting/index.vue"),
    layout: "dashboard",
    meta: {
      // layoutClass: 'default',
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("./pages/Login/index.vue"),
    // layout: "dashboard", //'default'
    meta: {
      // layoutClass: 'default',
      requiresAuth: false,
    },
  },
];

const addLayoutToRoute = (route, parentLayout = "default") => {
  route.meta = route.meta || {};
  route.meta.layout = route.layout || parentLayout;
  if (route.children) {
    route.children = route.children.map((childRoute) => addLayoutToRoute(childRoute, route.meta.layout));
  }
  return route;
};

routes = routes.map((route) => addLayoutToRoute(route));

const router = createRouter({
  history: createWebHistory("/"),
  // history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: "smooth",
      };
    }
    return {
      x: 0,
      y: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth) {
    if (!localStorage.getItem("access_token")) {
      return {
        path: "/login",
      };
    }
  } else {
    if (localStorage.getItem("access_token")) {
      return {
        path: "/",
      };
    }
  }
});

export default router;
