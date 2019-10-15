const menuManager = {
  data() {
  },
  computed: {
    links() {
      const links = [{
        title: 'Fondos Mutuos',
        url: '/gestion-de-inversiones/fondos-mutuos',
      },
      {
        title: 'Cuenta Activa',
        url: '/gestion-de-inversiones/cuenta-activa',
      },
      {
        title: 'APV',
        url: '/gestion-de-inversiones/apv',
      }];
      return links;
    },
  },
};
module.exports = {
  menuManager,
};
