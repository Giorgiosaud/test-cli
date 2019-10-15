<template>
  <div class="top d-block">
    <div id="mutual-funds-multiple">
      <div class="top-funds-multiple row no-gutters bottom-shadow">
        <div class="container">
          <div class="row no-gutters">
            <div class="col-md-4 check_custom p-3 p-md-4 justify-content-center section-divisor">
              <div class="row">
                <div class="col-12">
                  <h2><strong>{{ selectedSuscription }}</strong></h2>
                </div>
                <div class="col-12">
                  <h4>{{ tipoText }}{{ regimenText }}</h4>
                </div>
              </div>
            </div>

            <top-investments
              class="col-md-8 row no-gutters"/>
          </div>
        </div>
      </div>
    </div>
    <investments-table/>
    <div class="container">
      <div class="bottom-funds-multiple row no-gutters">
        <div class="col-2 py-4">
          <button
            class="btn btn-link text-white"
            @click="cancelar">Volver</button>
        </div>
        <div
          class="col-2 offset-3 p-4 text-right">
          <h3
            class="m-0">{{ format(toInvestAmount) }}</h3>
          <p
            class="m-0">Disponible para aporte</p>
        </div>
        <div
          class="col-2 p-4 text-right">
          <h3
            class="m-0">{{ format(investedAmount) }}</h3>
          <p
            class="m-0">Total aporte</p>
        </div>
        <div class="col-3 p-4">
          <button
            :disabled="disableInvestButon"
            class="btn btn-block btn-primary"
            @click="confirmDeposit" >Siguiente</button>
        </div>

      </div>
      <div class="legend row no-gutters">
        <div class="col-12 py-3">
          <p>
            <small>
              Infórmese de las características esenciales de la inversión en este Apv,
              las que se encuentran contenidas en su reglamento interno y contrato de suscripción
              de cuotas. La rentabilidad o ganancia obtenida en el pasado por este fondo, no garantiza
              que ella se repita en el futuro. Los valores de las cuotas de los fondos mutuos son
              variables.
            </small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { moneyFormat } from '../../../shared/variables';
import topInvestments from './topInvestments';
import detail from './detail';
import investmentsTable from './investmentsTable';

export default {
  components: {
    topInvestments,
    detail,
    investmentsTable,
  },
  data() {
    return {
      money: moneyFormat,
      loadingAmount: false,
      aporteMode: true,
    };
  },
  computed: {
    contractType() {
      return this.$store.state.apv.subscriptionType;
    },
    selectedDiscountType() {
      return this.$store.state.apv.amountType;
    },
    selectedSuscription() {
      return this.$store.state.selectedSuscriptionTitles[this.$store.state.apv.subscriptionType];
    },
    regimenText() {
      if (this.contractType === 'DS') {
        return `– Régimen ${this.$store.state.apv.regime.toUpperCase()}`;
      } else if (this.contractType === 'DD') { return `Régimen ${this.$store.state.apv.regime.toUpperCase()}`; }
      return '';
    },
    discountType() {
      return this.$store.state.discountType;
    },
    tipoText() {
      let text = '';
      switch (this.discountType) {
        case 'unlimited':
          text = 'Indefinido';
          break;
        case 'temporal':
          text = 'Temporal';
          break;
        default:
          text = '';
          break;
      }
      return text;
    },
    toInvestAmount() {
      return this.$store.getters.toInvestAmount;
    },
    endDate() {
      return this.$store.state.apv.endDate;
    },
    fromDate() {
      return this.$store.state.apv.fromDate;
    },
    disableInvestButon() {
      // preguntar si el contrato es temporal
      // si es temporal validar que exista fromDate y endDate
      // validar por monto


      if (this.discountType === 'temporal' && !this.endAndFromDateExist()) {
        return true;
      }
      return this.isContinueButtonDisabledByAmount();
    },
    investmentList() {
      return this.$store.getters.investmentList;
    },
    investedAmount() {
      return this.$store.getters.investedAmount;
    },
  },
  updated() {
    $('[data-toggle="tooltip"]').tooltip();
  },

  methods: {
    endAndFromDateExist() {
      return this.endDate !== '' && this.fromDate !== '';
    },
    isContinueButtonDisabledByAmount() {
      if (this.investedAmount === 0 || this.toInvestAmount !== 0) {
        return true;
      }
      return false;
    },
    format(amount) {
      switch (this.selectedDiscountType) {
        case 'uf':
          return this.$options.filters.currency(amount, 'UF');
        case 'clp':
          return this.$options.filters.currency(amount);
        default:
          return amount;
      }
    },
    cancelar() {
      if (this.contractType === 'DD') {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'mini-form');
      } else {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'full-form');
      }
    },
    confirmDeposit() {
      this.$store.commit('SET_MODAL_COMPONENT', 'invest-confirmation');
      this.$store.commit('SET_APV_INVESTMENT_FUNDS', this.$store.getters.investmentList);
      $('#modal').modal({ backdrop: 'static', keyboard: false });
    },
  },
};
</script>
<style lang="scss">
</style>
