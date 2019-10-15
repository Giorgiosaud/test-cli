const isProduction = {
  data() {
    return {
      isProduction: window.location.origin.indexOf('clientes.larrainvial.com') !== -1,
    };
  },
};
module.exports = {
  isProduction,
};
