<template>
  <div>

    <div class="row">
      <div class="col">
        <h4><strong>Evolución del valor cuota</strong></h4>
      </div>
    </div>
    <div
      v-if="isLoadingData"
      class="row chart-loader d-flex  align-items-center justify-content-center">
      <div class="loading-ico"/>
    </div>
    <error-request
      v-else-if="errorRequest"
      :error-request="errorRequest"
      class="h-100"/>
    <div
      v-else
      class="row">
      <div class="col d-flex flex-column">
        <div
          id="stockchart"
          ref="stockchart"/>
      </div>
    </div>
  </div>
</template>
<script>
import { graphData } from '../../../shared/variables';
import errorRequest from '../../../shared/global_components/errorRequest';

export default {
  name: 'MutualFundsDetailGraph',
  components: {
    'error-request': errorRequest,
  },
  data() {
    return {
      isLoadingData: true,
      errorRequest: false,
    };
  },
  computed: {
    selectedFund() {
      return this.$store.state.selectedFund;
    },
    showClientFunds() {
      return this.$store.state.showClientFunds;
    },
    graphicData() {
      return this.$store.state.graphicData;
    },
    StockData() {
      return this.graphicData.map(data => [
        new Date(data.informationDate).getTime(),
        parseFloat(data.quotaValue),
      ]);
    },
    stockOptions() {
      return {
        rangeSelector: {
          selected: 1,
        },
        title: {
          text: this.selectedFund.name,
        },
        series: [
          {
            name: this.selectedFund.nemo,
            data: this.StockData,
            tooltip: {
              valueDecimals: 2,
            },
          },
        ],
      };
    },
  },
  watch: {
    selectedFund() {
      this.getGraphData();
    },
  },
  created() {
    this.getGraphData();
  },
  updated() {
    if (!this.isLoadingData) this.reloadGraph();
  },
  methods: {
    reloadGraph() {
      const vm = this;
      graphData.series = [
        {
          type: 'area',
          name: this.selectedFund.nemo,
          data: this.StockData,
        },
      ];
      this.chart = Highcharts.StockChart(
        this.$refs.stockchart,
        graphData,
        (chart) => {
          // apply the date pickers
          setTimeout(() => {
            $(
              'input.highcharts-range-selector',
              $(chart.container).parent(),
            ).datepicker({
              minDate: new Date(vm.StockData[0][0]) || new Date(),
              maxDate:
                new Date(vm.StockData[vm.StockData.length - 1][0]) || new Date(),
            });
          }, 0);
        },
      );
      $.datepicker.setDefaults({
        changeMonth: true,
        changeYear: true,
        beforeShow(input, inst) {
          inst.dpDiv.css({ 'z-index': 1051 });
        },
        minDate: new Date(2009, 10 - 1, 8),
        maxDate: new Date(),
        onSelect() {
          this.onchange();
          this.onblur();
        },
      });
    },
    getGraphData() {
      this.isLoadingData = true;
      this.$store
        .dispatch('GET_GRAPHIC_DATA', {
          initialDate: moment('2000-01-01').format('YYYY-MM-DD'),
          finalDate: moment().format('YYYY-MM-DD'),
          nemo: this.selectedFund.nemoSiga,
        })
        .catch((error) => {
          this.errorRequest = error.response.data.error;
        })
        .finally(() => {
          this.isLoadingData = false;
        });
    },
  },
};
</script>
