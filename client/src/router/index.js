import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import ForgotPassword from "../views/ForgotPassword.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/forgotPassword",
    name: "ForgotPassword",
    component: ForgotPassword
  },
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true },
    name: 'Home',
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/forgotPassword'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }else if (loggedIn && !authRequired) {
    return next('/');
  }else {
    next();
  }

})

export default router;
