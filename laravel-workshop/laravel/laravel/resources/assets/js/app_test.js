
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('basic-info', require('./components/test/AppInfo.vue'));
Vue.component('db-info', require('./components/test/DBInfo.vue'));
Vue.component('aws-info', require('./components/test/AWSInfo.vue'));
Vue.component('auth-info', require('./components/test/AuthInfo.vue'));

import "../../../public/css/test_info.css";
const app = new Vue({
    el: '#app',
    data() {
        return { }
    },
    computed: { },
    methods: { }
});
