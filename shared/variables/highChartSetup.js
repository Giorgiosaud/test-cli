const graphData = {
  colors: ['#294647'],
  chart: {
    type: 'spline',
    zoomType: 'x',
  },
  credits: {
    enabled: false,
  },
  rangeSelector: {
    selected: 1,
    buttonTheme: {
      fill: '#b7c2c2',
      stroke: 'none',
      'stroke-width': 0,
      width: 60,
      height: 15,
      display: 'flex',
      padding: 10,
      r: 0,
      style: {
        color: 'white',
        fill: '#9b0821',
        fontWeight: 'bold',

      },
      states: {
        hover: {
          fill: '#2f4f51',
          style: {
            color: 'white',
          },
        },
        select: {
          fill: '#2f4f51',
          style: {
            color: 'white',
          },
        },
        disabled: {
          fill: '#f1f3f3',
          style: {
            color: '#ccc',
            cursor: 'not-allowed',
          },
        },
      },
    },
    buttons: [
      {
        type: 'month',
        count: 1,
        text: '1 mes',
      }, {
        type: 'month',
        count: 3,
        text: '3 meses',
      }, {
        type: 'month',
        count: 6,
        text: '6 meses',
      }, {
        type: 'ytd',
        text: 'Últ. año',
      },
      {
        type: 'all',
        text: 'Todo',
      },
    ],
    inputEnabled: true,
    inputDateFormat: '%d/%m/%Y',
    inputEditDateFormat: '%d/%m/%Y',
    inputDateParser(value) {
      const value2 = value.split('/');
      const fecha = new Date(`${value2[1]}-${value2[0]}-${value2[2]}`);
      return fecha.getTime();
    },
    inputPosition: {
      y: 10,
    },
  },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          colors: ['#fff'],
          rangeSelector: {
            selected: 1,
            buttonTheme: {
              fill: '#b7c2c2',
              stroke: 'none',
              'stroke-width': 0,
              width: 30,
              height: 15,
              display: 'flex',
              padding: 10,
              r: 0,
              style: {
                color: 'white',
                fill: '#9b0821',
                fontWeight: 'bold',

              },
              states: {
                hover: {
                  fill: '#2f4f51',
                  style: {
                    color: 'white',
                  },
                },
                select: {
                  fill: '#2f4f51',
                  style: {
                    color: 'white',
                  },
                },
                disabled: {
                  fill: '#f1f3f3',
                  style: {
                    color: '#ccc',
                    cursor: 'not-allowed',
                  },
                },
              },
            },
            buttons: [
              {
                type: 'month',
                count: 1,
                text: '1m',
              }, {
                type: 'month',
                count: 3,
                text: '3m',
              }, {
                type: 'month',
                count: 6,
                text: '6m',
              }, {
                type: 'ytd',
                text: '1a',
              }, {
                type: 'all',
                text: 'Todo',
              },
            ],
            inputEnabled: false,
            inputDateFormat: '%d/%m/%Y',
            inputEditDateFormat: '%d/%m/%Y',
            inputDateParser(value) {
              const value2 = value.split('/');
              return Date.UTC(
                parseInt(value2[2], 10),
                parseInt(value2[0], 10) - 1,
                parseInt(value2[1], 10),
              );
            },
          },
        },

      }],
  },
  title: {
    text: '',
  },
  tooltip: {
    formatter() {
      return `${Highcharts.dateFormat('%e de %b de %Y', new Date(this.x))}<br>Valor: ${this.y} $`;
    },
  },
  plotOptions: {
    area: {
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
        },
        stops: [
          [0, 'rgba(58, 102, 85, 1)'],
          [1, Highcharts.Color('rgba(58, 102, 85, 1)').setOpacity(0).get('rgba')],
        ],
      },
      threshold: null,
    },
  },
};
module.exports = {
  graphData,
};
