<template>
  <div>
    <div
      v-if="loadingFunds"

      class="container-fluid height-limited">
      <div class="d-flex align-items-center justify-content-center h-100">
        <div class="loading-ico"/>
      </div>
    </div>
    <div
      v-else
      :class="{wait:multiInvestAmount===0}"
      class="container height-limited investments-table">
      <div class="titles-multiple-invest pt-3">
        <div class="row no-gutters">
          <p
            class="mb-0 col-4">Fondo Mutuo</p>
          <p class="mb-0 col-1 p-2 text-center">Ficha Web</p>
          <p class="mb-0 col-1 p-2 text-center">Riesgo <i
            class="mdi mdi-information-outline"
            data-toggle="tooltip"
            data-html="true"
            data-placement="bottom"
            title="<p class='my-1'>
              Riesgo bajo: <span class='risk-low fund-risk text-center d-block float-right'></span>
              </p>
              <p class='my-1'>
                Riesgo medio: <span class='risk-mid fund-risk text-center d-block float-right'></span>
                </p>
                <p class='my-1'>
                  Riesgo alto: <span class='risk-high fund-risk text-center d-block float-right'></span>
                  </p>"/></p>
          <p class="mb-0 col-2 p-2 text-center">Rent. mes anterior</p>
          <p class="mb-0 col-2 p-2 text-right">Porcentaje</p>
          <p class="mb-0 col-2 p-2 text-right">Monto a invertir</p>
        </div>
      </div>
      <div class="list-multiple-invest mb-2">
        <error-request
          v-if="errorRequest"
          :error-request="errorRequest"
          class="h-100"/>
        <invest
          v-for="(fund,index) in mutualFundsToInvest"
          v-else
          :fund="fund"
          :key="index"/>
      </div>
    </div>
  </div>
</template>

<script>
import invest from './invest';
import errorRequest from '../../../shared/global_components/errorRequest';

export default {
  components: {
    invest,
    errorRequest,
  },
  computed: {
    amountType() {
      return this.$store.state.apv.amountType;
    },
    bounders() {
      return this.$store.state.bounders;
    },
    errorRequest() {
      return this.$store.state.errorRequest;
    },
    mutualFundsToInvest() {
      return this.$store.state.mutualFundsToInvest;
    },
    multiInvestAmount() {
      return this.$store.state.apv.amount;
    },
    loadingFunds() {
      return this.$store.state.loadingApvs;
    },
  },
  mounted() {
    $('[data-toggle="tooltip"]').tooltip({ html: true });
  },
  updated() {
    $('[data-toggle="tooltip"]').tooltip({ html: true });
  },
};
</script>
