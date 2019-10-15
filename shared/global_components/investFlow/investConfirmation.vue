<template>
  <div class="modal-content">
    <div class="modal-header dotted-bottom text-center p-3 p-md-4">
      <h3 class="modal-title"><b>Solicitud de Aporte {{ type }}</b></h3>
    </div>
    <div class="modal-body">
      <div class="header-description">
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Fecha</div>
            <div class="header-description-value">{{ date }}</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">Cuenta</div>
            <div class="header-description-value">{{ selectedFromAccount.name }}</div>
          </div>
        </div>
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Tipo</div>
            <div class="header-description-value">Aporte</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">Monto Total</div>
            <div class="header-description-value">{{ investedAmount|currency }}</div>
          </div>
        </div>
      </div>
      <div class="funds-description">
        <div class="funds-description-detail-header">
          <b>Detalle del Aporte</b>
        </div>
        <div class="funds-description-detail">
          <div class="funds-description-detail-headers">
            <div class="funds-description-detail-headers--title">Nombre FFMM</div>
            <div class="funds-description-detail-headers--title">Monto</div>
          </div>
          <div class="funds-description-detail-funds">
            <div
              v-for="(invest,index) in investmentListFullData"
              :key="index"
              class="funds-description-detail-elements">
              <div class="funds-description-detail-body--name">{{ invest.name }}</div>
              <div class="funds-description-detail-body--amount">{{ invest.amount|currency }}</div>
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
          @click="makeDeposit">Confirmar Aporte
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'Fondos Mutuos',
    },
  },
  data() {
    return {
      date: moment().format('DD-MM-YYYY'),
    };
  },
  computed: {
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
  },
  created() {
    if (this.selectedFromAccount.type !== 'bank') {
      this.$store.commit('SET_SELECTED_TO_ACCOUNT', this.selectedFromAccount);
    }
  },
  methods: {
    makeDeposit() {
      if (this.selectedFromAccount.type === 'bank') {
        return this.$store.commit('SET_MODAL_COMPONENT', 'invest-from-bank');
      }
      return this.$store.commit('SET_MODAL_COMPONENT', 'invest-voucher');
    },
    cancel() {
      $('#modal').modal('hide');
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
    flex-direction: column;
    justify-content: center;
  }
}
</style>
