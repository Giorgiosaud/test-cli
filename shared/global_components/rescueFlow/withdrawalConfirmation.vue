<template>
  <div class="modal-content">
    <div class="modal-header dotted-bottom">
      <h3 class="p-3 modal-title"><b>Solicitud de Rescate Fondos Mutuos</b></h3>
    </div>
    <div class="modal-body pt-0">
      <div class="header-description">
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Origen</div>
            <div class="header-description-value">{{ selectedInvestmentAccount.name }}</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">Destino</div>
            <div
              v-if="selectedDestinationAccount.type==='bank'"
              class="header-description-value">
              {{ selectedDestinationAccount.accountName }}
              <br>
              {{ selectedDestinationAccount.accountNumber }}
            </div>
            <div
              v-else
              class="header-description-value">{{ selectedDestinationAccount.accountName }}</div>
          </div>
        </div>
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Fecha</div>
            <div class="header-description-value">{{ date }}</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">Tipo</div>
            <div class="header-description-value">Rescate</div>
          </div>
        </div>
        <div class="header-description-row">
          <div class="header-description-element px-0 justify-content-start">
            <div class="header-description-label">Monto Total</div>
            <div class="header-description-value ml-4">{{ withdrawalAmount|currency }}</div>
          </div>
        </div>
      </div>
      <div class="funds-description">
        <div class="funds-description-detail-header">
          <b>Detalle del Rescate</b>
        </div>
        <div class="funds-description-detail">
          <div class="funds-description-detail-headers">
            <div class="funds-description-detail-headers--title">Nombre FFMM</div>
            <div class="funds-description-detail-headers--title">Monto</div>
          </div>
          <div class="funds-description-detail-funds">
            <div
              v-for="(invest,index) in withdrawalListFullData"
              :key="index"
              class="funds-description-detail-elements">
              <div class="funds-description-detail-body--name">{{ invest.name }}</div>
              <div class="funds-description-detail-body--amount">{{ invest.amount|currency }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="terms">
        <p><a
          href="https://media.larrainvial.com/lvassetmanagement/documentacion/tiempo-rescate/rescatesffmm.pdf"
          target="_blank">Ver plazos normativos de rescate de fondos mutuos</a></p>
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
          @click="makeWithdraw">Confirmar Rescate
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: moment().format('DD-MM-YYYY'),
    };
  },
  computed: {
    simpleMode() {
      return this.$store.state.simpleMode;
    },
    selectedInvestmentAccount() {
      return this.$store.state.selectedInvestmentAccount;
    },
    selectedDestinationAccount() {
      return this.$store.state.selectedDestinationAccount;
    },
    withdrawalList() {
      return this.$store.getters.withdrawalList;
    },
    withdrawalListFullData() {
      return this.$store.getters.withdrawalListFullData;
    },
    withdrawalAmount() {
      return this.$store.getters.withdrawalAmount;
    },
  },
  created() {
  },
  methods: {
    modifyBankDeposit() { return false; },
    makeWithdraw() {
      return this.$store.commit('SET_MODAL_COMPONENT', 'withdraw-voucher');
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
  .modal-body {
    padding: 2rem 0.5rem;
  }
  .header-description-element {
    flex-direction: column;
    justify-content: center !important;
  }
  .header-description-value.ml-4 {
    margin-left: 0 !important;
  }
}
</style>
