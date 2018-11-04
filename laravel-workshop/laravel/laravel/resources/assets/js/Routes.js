import VueRouter from 'vue-router';

const index = {template:'<div>this is index.</div>'};
const NotFound = { template: '<div>not found</div>' };

let routes = [
    { path: '/jj/public/home', name: 'index-none', component: require('./components/home/HomeMaster') },
    { path: '/jj/public/bookkeeping', name: 'bookkeeping',component: require('./components/bookkeeping/BookkeepingMaster') },

    { path: '*', name: '404', component: NotFound  }
];


export default new VueRouter({
    mode: 'history',
    routes
});