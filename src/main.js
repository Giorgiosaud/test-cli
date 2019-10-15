/* eslint import/no-unresolved: [0] */
/* eslint no-new: [0] */
import Vue from 'vue';
import App from './App';
import store from './store';
import '../shared/vue_filters';

new Vue({
  el: '#apv',
  store,
  render: h => h(App),
});
