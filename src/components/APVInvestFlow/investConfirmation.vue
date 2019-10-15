<template>
  <div class="modal-content">
    <div class="modal-header dotted-bottom text-center p-3 p-md-4">
      <h3 class="modal-title"><b>Solicitud de Ahorro APV</b></h3>
    </div>
    <div class="modal-body">
      <div class="header-description">
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Fecha</div>
            <div class="header-description-value">{{ date }}</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">APV</div>
            <div class="header-description-value">{{ selectedSuscriptionTitles[systematicDiscountType] }}</div>
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
          v-if="systematicDiscountType === 'DC' && selectedSubscriptionType === 'temporal' "
          class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Tipo</div>
            <div class="header-description-value">{{ systematicDiscountTypeName[selectedSubscriptionType] }}</div>
          </div>
          <div
            class="header-description-element">
            <div
              class="header-description-label"
              v-text="montoText"/>
            <div class="header-description-value">{{ totalAmount }}</div>
          </div>
        </div>

        <div
          v-if="systematicDiscountType === 'DC' && selectedSubscriptionType === 'unlimited' "
        >
          <div class="header-description-row">
            <div class="header-description-element">
              <div class="header-description-label">Tipo</div>
              <div class="header-description-value">{{ systematicDiscountTypeName[selectedSubscriptionType] }}</div>
            </div>
            <div
              v-if="selectedSubscriptionType !== 'temporal'"
              class="header-description-element">
              <div class="header-description-label">Primer mes de descuento</div>
              <div class="header-description-value">{{ firstMonthDiscount | monthFormat }}</div>
            </div>
          </div>

          <div class="header-description-row">
            <div
              class="header-description-element">
              <div
                class="header-description-label"
                v-text="montoText"/>
              <div class="header-description-value">{{ totalAmount }}</div>
            </div>
          </div>
        </div>


        <div
          v-if="systematicDiscountType === 'DS'"
          class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Tipo</div>
            <div class="header-description-value">{{ systematicDiscountTypeName[selectedSubscriptionType] }}</div>
          </div>
          <div
            v-if="regime"
            class="header-description-element">
            <div class="header-description-label">Régimen</div>
            <div class="header-description-value">{{ regime.toUpperCase() }}</div>
          </div>
        </div>


        <div
          v-if="systematicDiscountType === 'DS'"
          class="header-description-row">
          <div
            v-if="selectedSubscriptionType === 'unlimited'"
            class="header-description-element" >
            <div class="header-description-label">Primer mes de descuento</div>
            <div class="header-description-value">{{ firstMonthDiscount | monthFormat }}</div>
          </div>


          <div
            v-if="systematicDiscountType !== 'DD'"
            class="header-description-element">
            <div
              class="header-description-label"
              v-text="montoText"/>
            <div class="header-description-value">{{ totalAmount }}</div>
          </div>

          <div
            v-if="systematicDiscountType === 'DD'"
            class="header-description-element">
            <div
              class="header-description-label"
              v-text="montoText"/>
            <div class="header-description-value">{{ totalAmount }}</div>
          </div>
        </div>


        <div
          v-if="systematicDiscountType === 'DD'"
          class="header-description-row">
          <div
            v-if="regime"
            class="header-description-element">
            <div class="header-description-label">Régimen</div>
            <div class="header-description-value">{{ regime.toUpperCase() }}</div>
          </div>

          <div
            class="header-description-element">
            <div
              class="header-description-label"
              v-text="montoText"/>
            <div class="header-description-value">{{ totalAmount }}</div>
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
        <p>
          La comunicación que UD. ha efectuado a través del sitio web constituye
          confirmación por escrito para los efectos dispuestos en el literal c) del
          numeral 4 de la letra A.1. de la Norma de Carácter General Nº12 de la
          Superintendencia de Valores y Seguros y de conformidad a lo indicado en su
          Ficha de Cliente.
        </p>

        <p>
          Infórmese de las características esenciales de la Inversión en este fondo mutuo,
          las que se encuentran contenidas en su reglamento interno y contrato de
          suscripción de cuotas. La rentabilidad o ganancia obtenida en el pasado por
          este fondo, no garantiza que ella se repita en el futuro. Los valores de las
          cuotas de los fondos mutuos son variables.
        </p>
      </div>
    </div>
    <div class="modal-footer justify-content-between top-shadow p-3 p-md-4 reverse">
      <button
        type="button"
        class="btn btn-link text-left mr-auto"
        @click="cancel">Cancelar
      </button>
      <div>
        <button
          type="button"
          class="btn btn-primary btn-block"
          @click="nextStep">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    monthFormat(value) {
      return moment(value).format('MM-YYYY');
    },
  },
  data() {
    return {
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
    montoText() {
      return this.systematicDiscountType === 'DD' ? 'Aporte' : 'Monto de descuento';
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
    totalAmount() {
      if (this.selectedDiscountType === 'clp') {
        return this.$options.filters.currency(this.investedAmount);
      } else if (this.selectedDiscountType === 'income_percentage') { return `${this.$store.state.apv.amount} %`; }
      return this.$options.filters.currency(this.investedAmount, 'UF');
    },
    selectedSubscriptionType() {
      return this.$store.state.discountType;
    },
    systematicDiscountType() {
      return this.$store.state.apv.subscriptionType;
    },
  },
  created() {
  },
  methods: {
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
      $('#modal')
        .modal('hide');
    },
  },
};
</script>
<style lang="scss" scoped>
//colors
$seashell: #f1f1f1;
$color_mountain_mist_approx: #999;

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

@media (max-width: 530px) {
  .header-description-element {
    border-bottom: 1px solid #f1f1f1;
    flex-direction: row;
    justify-content: space-between;
  }
  .header-description-row {
    flex-direction: column;
  }
  .header-description-element:nth-child(2) {
    padding-left: 0;
    border-right: none;
    border-left: none;
  }
}
</style>
