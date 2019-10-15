<template>
  <div class="modal-content">
    <div
      v-if="onPaymentFlow"
      class="modal-header justify-content-center p-3 p-md-4">
      <h3 class="modal-title">
        <b>Realizando Suscripción</b>
      </h3>
    </div>
    <div
      v-else
      class="modal-header justify-content-center p-3 p-md-4">
      <h3
        v-if="success"
        class="modal-title">
        <b>
          <i class="mdi mdi-check-circle response__icon"/>  {{ selectedSubscriptionDetail.successMessage }}
        </b>

      </h3>
      <h3
        v-else
        class="modal-title">
        <b>
          <i class="mdi mdi-close-circle response__icon response__icon--fail"/>
          {{ selectedSubscriptionDetail.errorMessage }}
        </b>
      </h3>
    </div>
    <div
      v-if="onPaymentFlow"
      class="modal-body">
      <div
        class="modal-body p-0 align-items-center justify-content-center d-flex">
        <div class="loader">
          <div class="d-flex align-items-center justify-content-center h-100 flex-column">
            <div class="loading-ico"/>
            <div
              v-if="selectedFromAccount && selectedFromAccount.type==='bank'"
              class="loading-description pt-3 text-muted">
              Comunicándonos con entidad Bancaria
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="modal-body">
      <div class="header-description">

        <div
          v-if="subscriptionType === 'DD'">
          <div class="header-description-row">
            <div class="header-description-element">
              <div class="header-description-label">Fecha</div>
              <div class="header-description-value">{{ date }}</div>
            </div>
            <div class="header-description-element">
              <div class="header-description-label">Folio</div>
              <div class="header-description-value">{{ numeroDeFolio }}</div>
            </div>
          </div>
          <div class="header-description-row">
            <div class="header-description-element">
              <div class="header-description-label">APV</div>
              <div class="header-description-value">{{ selectedSuscriptionTitles[subscriptionType] }}</div>
            </div>
            <div
              v-if="subscriptionType !== 'DC'"
              class="header-description-element">
              <div class="header-description-label">Régimen</div>
              <div class="header-description-value">{{ regime.toUpperCase() }}</div>
            </div>
          </div>
          <div class="header-description-row">
            <div class="header-description-element">
              <div
                class="header-description-label"
                v-text="montoText"/>
              <div class="header-description-value">{{ amountTransform(investedAmount) }}</div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="header-description-row">
            <div class="header-description-element">
              <div class="header-description-label">Fecha</div>
              <div class="header-description-value">{{ date }}</div>
            </div>
            <div class="header-description-element">
              <div class="header-description-label">Folio</div>
              <div class="header-description-value">{{ numeroDeFolio }}</div>
            </div>
          </div>
          <div class="header-description-row">
            <div class="header-description-element">
              <div class="header-description-label">APV</div>
              <div class="header-description-value">{{ selectedSuscriptionTitles[subscriptionType] }}</div>
            </div>
            <div class="header-description-element">
              <div class="header-description-label">Tipo</div>
              <div class="header-description-value">{{ systematicDiscountTypeName[selectedSubscriptionType] }}</div>
            </div>
          </div>
          <div
            v-if="selectedSubscriptionType==='temporal'"
            class="header-description-row">
            <div class="header-description-element">
              <div class="header-description-label">Primer mes de descuento</div>
              <div class="header-description-value">{{ startDate }}</div>
            </div>
            <div class="header-description-element">
              <div class="header-description-label">Último mes de descuento</div>
              <div class="header-description-value">{{ endDate }}</div>
            </div>
          </div>


          <div
            v-if="subscriptionType === 'DC' && selectedSubscriptionType === 'unlimited' "
            class="header-description-row">
            <div
              class="header-description-element">
              <div class="header-description-label">Primer mes de descuento</div>
              <div class="header-description-value">{{ firstMonthDiscount | monthFormat }}</div>
            </div>
            <div
              class="header-description-element">
              <div class="header-description-label">Monto de descuento mensual</div>
              <div class="header-description-value">{{ amountTransform(investedAmount) }}</div>
            </div>
          </div>


          <div
            v-else
            class="header-description-row">
            <div
              v-if="subscriptionType !== 'DC'"
              class="header-description-element">
              <div class="header-description-label">Régimen</div>
              <div class="header-description-value">{{ regime.toUpperCase() }}</div>
            </div>
            <div
              v-if="selectedSubscriptionType === 'unlimited'"
              class="header-description-element">
              <div class="header-description-label">Primer mes de descuento</div>
              <div class="header-description-value">{{ firstMonthDiscount | monthFormat }}</div>
            </div>
            <div
              v-if="selectedSubscriptionType !== 'unlimited'"
              class="header-description-element">
              <div class="header-description-label">Monto de descuento mensual</div>
              <div class="header-description-value">{{ amountTransform(investedAmount) }}</div>
            </div>
          </div>
          <div
            v-if="selectedSubscriptionType === 'unlimited' && subscriptionType !== 'DC'"
            class="header-description-row">
            <div class="header-description-element">
              <div class="header-description-label">Monto de descuento mensual</div>
              <div class="header-description-value">{{ amountTransform(investedAmount) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="funds-description">
        <div class="funds-description-detail-header">
          <b>Detalle del Aporte</b>
        </div>
        <div class="funds-description-detail">
          <div class="funds-description-detail-headers">
            <div class="funds-description-detail-headers--title">Fondo Mutuo Serie APV</div>
            <div
              v-if="selectedDiscountType==='income_percentage'"
              class="funds-description-detail-headers--title">Porcentaje</div>
            <div
              v-else
              class="funds-description-detail-headers--title">Monto</div>
          </div>
          <div class="funds-description-detail-funds">
            <div
              v-for="(invest,index) in investmentListFullData"
              :key="index"
              class="funds-description-detail-elements">
              <div class="funds-description-detail-body--name">{{ invest.name }}</div>
              <div class="funds-description-detail-body--amount">{{ investValue(invest) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="terms">
        <!--p>Le Hemos enviado un correo a {{ email }} con el comprobante de este suscripción.</p-->
      </div>
    </div>
    <div class="modal-footer justify-content-center top-shadow p-3 p-md-4 reverse">
      <button
        type="button"
        class="btn btn-primary btn-lg px-large"
        @click="cancel">Cerrar
      </button>
    </div>
  </div>
</template>

<script>
import bankFlowLogic from '../../../shared/mixins/bankFlowLogic';

export default {
  filters: {
    monthFormat(value) {
      return moment(value).format('MM-YYYY');
    },
  },
  mixins: [bankFlowLogic],
  data() {
    return {
      success: false,
      onPaymentFlow: true,
      date: moment()
        .format('DD-MM-YYYY'),
      selectedSuscriptionName: {
        systematic: 'Descuento Sistemático',
      },
      systematicDiscountTypeName: {
        unlimited: 'Indefinido',
        temporal: 'Temporal',
      },
    };
  },
  computed: {
    apv() {
      return this.$store.state.apv;
    },
    employer() {
      return this.$store.state.employer;
    },
    numeroDeFolio() {
      return this.$store.state.numeroDeFolio;
    },
    montoText() {
      return this.subscriptionType === 'DD' ? 'Aporte' : 'Monto de descuento';
    },
    isInBankFlow() {
      return !!this.$store.state.paymentWindow;
    },
    email() {
      return window.liquid.user.email;
    },
    selectedSuscriptionTitles() {
      return this.$store.state.selectedSuscriptionTitles;
    },
    selectedDiscountType() {
      return this.$store.state.apv.amountType;
    },
    startDate() {
      return moment(this.$store.getters.dates[0]).format('MM-YYYY');
    },
    endDate() {
      return moment(this.$store.getters.dates[1]).format('MM-YYYY');
    },
    firstMonthDiscount() {
      if (moment().isBefore(moment().date(16).hour(0).minutes(0)
        .seconds(0))) {
        return moment().day(1).toDate();
      }
      return moment().add(1, 'months').day(1).toDate();
    },
    regime() {
      return this.$store.state.apv.regime;
    },
    simpleMode() {
      return this.$store.state.simpleMode;
    },
    selectedFromAccount() {
      return this.$store.state.selectedFromAccount;
    },
    investmentListFullData() {
      return this.$store.getters.investmentListFullData;
    },
    investedAmount() {
      return this.$store.getters.investedAmount;
    },
    selectedSubscriptionType() {
      return this.$store.state.discountType;
    },
    subscriptionType() {
      return this.$store.state.apv.subscriptionType;
    },
    selectedSubscriptionDetail() {
      return this.$store.state.suscriptions.find(subscription => this.subscriptionType === subscription.type);
    },
  },
  created() {
    if (this.isInBankFlow) {
      this.initPaymentStatusCheckInterval();
    } else {
      const apv = _.pickBy(this.$store.state.apv);
      const employer = _.pickBy(this.$store.state.employer);
      this.$store.dispatch('SEND_CONTRACT', { apv, employer })
        .then((response) => {
          this.success = true;
          this.$store.commit('SET_NUMERO_DE_FOLIO', response.data.data.folio);
        })
        .catch(() => {
          this.success = false;
          this.$store.commit('SET_NUMERO_DE_FOLIO', 'N/A');
        })
        .finally(() => {
          this.onPaymentFlow = false;
        });
    }
  },
  methods: {
    amountTransform(amount) {
      switch (this.selectedDiscountType) {
        case 'uf':
          return this.$options.filters.currency(amount, 'UF');
        case 'clp':
          return this.$options.filters.currency(amount);
        case 'income_percentage':
          return this.$options.filters.percentage(amount);
        default:
          return amount;
      }
    },
    investValue(invest) {
      switch (this.selectedDiscountType) {
        case 'uf':
          return this.$options.filters.currency(invest.uf, 'UF');
        case 'clp':
          return this.$options.filters.currency(invest.clp);
        case 'income_percentage':
          return this.$options.filters.percentage(invest.percentage);
        default:
          return invest.amount;
      }
    },
    nextStep() {
      return this.$store.commit('SET_MODAL_COMPONENT', 'prefilled-contract');
    },
    cancel() {
      if (this.success) window.location.reload();
      $('#modal')
        .modal('hide');
    },
    resetInvestValues() {
      this.$store.commit('CLEAN_INVESTMENTS');
    },
  },
};
</script>
<style lang="scss" scoped>
//colors
$seashell: #f1f1f1;
$color_mountain_mist_approx: #999;
$color_aqua_forest_approx: #579e78;
$color_burgundy_approx: #9b0822;
$color_suva_gray_approx: #888;

.header-description {
  width: 95%;
  margin: auto;
}

.header-description-row {
  display: flex;
  border-bottom: 1px solid $seashell;
}

.header-description-element {
  flex: 1;
  display: flex;
  justify-content: space-between;
  min-height: 70px;
  align-items: center;
  padding-right: 10px;

  &:nth-child(2) {
    padding-left: 20px;
    border-right: none;
    border-left: 1px solid $seashell;
  }
}

.header-description-label {
  font-weight: bold;
}

.funds-description {
  width: 95%;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  border-bottom: 1px solid $seashell;
}

.funds-description-detail-header--title {
  font-weight: bold;
}

.funds-description-detail-header {
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.funds-description-detail-headers {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.funds-description-detail-headers--title {
  padding: 0.5rem;
}

.funds-description-detail-funds {
  max-height: 120px;
  overflow: auto;
}

.funds-description-detail-elements {
  display: flex;
  width: 100%;
  justify-content: space-between;
  background: $seashell;

  &:not(:first-child) {
    margin-top: 5px;
  }
}

.funds-description-detail-body--name {
  padding: 0.5rem;
}

.funds-description-detail-body--amount {
  padding: 0.5rem;
}

.terms {
  width: 95%;
  margin: auto;
  padding: 10px 0;
  color: $color_mountain_mist_approx;

  p:last-child {
    margin: 0;
  }
}

.transaction-details {
  background: $seashell;
}

.response__icon {
  font-size: 4rem;
  color: $color_aqua_forest_approx;
  vertical-align: middle;
  &.response__icon--fail {
    font-size: 4rem;
    color: $color_burgundy_approx;
    vertical-align: middle;
  }
}
.response__title {
  font-weight: bold;
  color: $color_suva_gray_approx;
  display: flex;
  flex-direction: column;
  p {
    font-size: 0.9rem;
    font-weight: normal;
  }
}
.px-large {
  padding: 0.7rem 6rem;
}
@media (max-width: 530px) {
  .header-description-element {
    flex-direction: column;
    justify-content: center;
  }
}
</style>
