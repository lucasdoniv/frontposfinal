import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Index';
import Login from '../components/Login';
import Register from '../components/Register';
import ModelAuto from '../components/ModelAuto';
import Car from '../components/Car';

Vue.use(VueRouter)



export default new VueRouter({
    routes: [{
        path: '/',
        component: Index
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/model',
        component: ModelAuto 
    },
    {
        path: '/car',
        component: Car 
    },
]
})