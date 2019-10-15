

window.developer = true;
window.baseUrl = 'https://larrainvial.modyo.be';
// window.ngrock = '';

window.liquid = {
  user: {
    firstName: 'Jorge',
    name: 'Jorge Saud',
    nombre_de_agente: '',
    rut: '26321598-2',
    isJuridic: false,
    targets: 'developer,Alto Patrimonio,agresivo',
    email: 'jsaud@modyo.com',
  },
  agresivo: false,
  altoPatrimonio: false,
  developer: true,
  url: 'https://larrainvial.modyo.be/privado',
  originUrl: 'https://larrainvial.modyo.be',
};
let bussinessRules = [
  {
    id: '1',
    glosa: 'Normativa NCG380',
    order: '1',
    estado_larra: '0',
    estado_aplicacion: '0',
    restrictivo: '1',
    activo: '1',
  },
  {
    id: '3',
    glosa: 'Formulario KYC',
    order: '3',
    estado_larra: '1',
    estado_aplicacion: '1',
    restrictivo: '0',
    activo: '1',
  },
  {
    id: '2',
    glosa: 'Encuesta Perfil',
    order: '2',
    estado_larra: '1',
    estado_aplicacion: '1',
    restrictivo: '0',
    activo: '1',
  },
];
bussinessRules = bussinessRules.sort((rulea, ruleb) => parseInt(rulea.order, 10) - parseInt(ruleb.order, 10));
if (!localStorage.getItem('bussinessRules')) {
  localStorage.setItem(
    'actualPlace',
    'https://larrainvial.modyo.be/privado/resumen',
  );
  localStorage.setItem('singingRerstrited', 0);
  localStorage.setItem('openedByBR', 1);
  localStorage.setItem('showTablePopup', 1);
  localStorage.setItem('bussinessRules', JSON.stringify(bussinessRules));
}
function gtag(evento, nombreEvento, payload) { console.log(evento, nombreEvento, payload); }
