import NButton from './packages/n-button'

const components = {
   NButton,
}

const install = function (Vue, options = {}) {

  Object.keys(components).forEach(key => {
    Vue.component(key, components[key]);
  });
}

export default install
