import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
export const getcfg = () => {
  return Vue.http.get('/auth/getAuthList');
};
export const getuserName = () => {
  return Vue.http.get('/sso/admin/adminInfo');
};
export const getInfo = () => {
  return Promise.all([getcfg(), getuserName()]);
};
