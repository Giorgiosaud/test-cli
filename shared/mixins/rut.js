const rut = {
  methods: {
    removeRutFormat(data) {
      return data.replace(/[^\d|K]/gi, '');
    },
    formatearRut(data) {
      if (data === '') {
        return '';
      }
      const validador = data.split('').splice(-1)[0];
      let number = data.slice(0, -1);
      number = parseInt(number, 10).toString();
      if (Number.isNaN(number)) {
        return validador;
      }
      let rutPuntos = '';
      let j = 1;
      for (let i = number.length - 1; i >= 0; i -= 1) {
        const letra = number.charAt(i);
        rutPuntos = letra + rutPuntos;
        if (j % 3 === 0 && j <= number.length - 1) {
          rutPuntos = `.${rutPuntos}`;
        }
        j += 1;
      }
      return `${rutPuntos}-${validador}`;
    },
  },
};
module.exports = {
  rut,
};
