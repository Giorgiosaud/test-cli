<template>
  <div class="modal-content">
    <div
      v-if="!onPaymentFlow"
      class="modal-header dotted-bottom justify-content-center">
      <h3 class="modal-title response__title text-center">
        <i
          :class="{
            'mdi-check-circle response__icon':isSuccess,
            'mdi-close-circle response__icon response__icon--fail':!isSuccess}"
          class="mdi"/>
        <div v-if="isTransferTo && isSuccess">
          <b>Solicitud de transferencia realizada con éxito</b>

          <!--p>El monto solicitado será depositado en su cuenta corriente en un máximo de 1 día hábil.</p-->
        </div>
        <div v-else-if="isTransferTo && !isSuccess">
          <b>Solicitud de transferencia fallida</b>
          <p>Su solicitud de transferencia desde el Banco {{ selectedBank.name }} hacia su cuenta de
          LarrainVial no se procesó.</p>
        </div>
        <div v-else-if="!isTransferTo && isSuccess">
          <b>Aporte realizado con éxito</b>

          <p>El monto solicitado será depositado en su fondo seleccionada en un máximo de 1 día hábil.</p>
        </div>
        <div v-else >
          <b>Solicitud de aporte fallido</b>
          <p>Su solicitud de aporte desde el Banco {{ selectedBank.name }} hacia fondo no se procesó.</p>
        </div>
      </h3>
    </div>
    <div
      v-if="onPaymentFlow"
      class="modal-body p-0 align-items-center justify-content-center d-flex">
      <div class="loader">
        <div class="d-flex align-items-center justify-content-center h-100 flex-column">
          <div class="loading-ico"/>
          <div
            v-if="selectedFromAccount.type==='bank'"
            class="loading-description pt-3 text-muted">
            Comunicándonos con entidad Bancaria
          </div>
          <div
            v-else
            class="loading-description pt-3 text-muted">
            Realizando Aporte
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="isTransferTo"
      class="modal-body p-0">
      <div class="header-description">
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Datos del Cliente</div>
          </div>
        </div>
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Rut Del Cliente</div>
            <div class="header-description-value">{{ fullRut }}</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">Nombre del Cliente</div>
            <div class="header-description-value">{{ clientName }}</div>
          </div>
        </div>
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Datos de la Transaccion</div>
          </div>
        </div>
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Fecha</div>
            <div class="header-description-value">{{ date }}</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">Nº de Operacion</div>
            <div class="header-description-value">{{ operationCode }}</div>
          </div>
        </div>
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Origen</div>
            <div class="header-description-value">{{ selectedBank.name }}</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">Destino</div>
            <div class="header-description-value">{{ selectedToAccount.name }}</div>
          </div>
        </div>
      </div>

    </div>
    <div
      v-else
      class="modal-body p-0">
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
          <div class="funds-description-detail-header--title"> Detalle del Aporte
          </div>
          <div
            v-if="selectedFromAccount.type==='bank'"
            class="funds-description-detail-header--oc">
            <b>Código de Operación:</b> {{ operationCode }}
          </div>

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
    </div>
    <div
      v-if="!onPaymentFlow && !isTransferTo"
      class="modal-footer justify-content-center top-shadow p-3 p-md-4 reverse">
      <div class="col-12 col-md-6">
        <button
          type="button"
          class="btn btn-primary btn-block mr-auto"
          @click="cancel">
          Cerrar
        </button>
      </div>
    </div>
    <div
      v-else-if="!onPaymentFlow && !isSuccess && isTransferTo"
      class="modal-footer justify-content-center top-shadow p-3 p-md-4 reverse">
      <div class="col-12 text-right">
        <button
          type="button"
          class="btn btn-primary"
          @click="reloadPaymentPage">
          Reintentar Transferencia
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isTransferTo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      date: moment().format('DD-MM-YYYY'),
      onPaymentFlow: true,
      checkPaymentIteration: 0,
      result: 'consulting',
      isSuccess: false,
    };
  },
  computed: {
    apv() {
      return this.$store.state.apv;
    },
    employer() {
      return this.$store.state.employer;
    },
    operationCode() {
      return this.$store.state.operationCode;
    },
    selectedFromAccount() {
      return this.$store.state.selectedFromAccount;
    },
    selectedToAccount() {
      return this.$store.state.selectedToAccount;
    },
    investedAmount() {
      return this.$store.getters.investedAmount;
    },
    investmentList() {
      return this.$store.getters.investmentList;
    },
    selectedBank() {
      return this.$store.state.selectedBank;
    },
    checkPaymentMaxTimes() {
      return this.$store.state.checkPaymentMaxTimes;
    },
    paymentWindow() {
      return this.$store.state.paymentWindow;
    },
    investmentListFullData() {
      return this.$store.getters.investmentListFullData;
    },
    fullRut() {
      return `${this.$store.state.rut}-${this.$store.state.rutValidator}`;
    },
    clientName() {
      return window.liquid.user.name;
    },
  },
  created() {
    if (this.selectedFromAccount.type === 'bank') {
      return this.checkPaymentStatus();
    }

    return this.postInvestment();
  },
  methods: {
    reloadPaymentPage() {
      return window.location.reload();
    },
    checkPaymentStatus() {
      const vm = this;
      this.checkTransactionState = setInterval(() => {
        vm.checkPaymentIteration += 1;
        vm.checkTransaction();
      }, 4000);
    },
    postInvestment() {
      const vm = this;
      this.onPaymentFlow = true;
      const transactions = _.map(this.investmentList, (invest) => {
        const investMap = invest;
        investMap.amount = investMap.amount.toString();
        return investMap;
      });
      const payload = {
        accountNumber: this.selectedToAccount.number,
        transactions,
      };
      this.$store
        .dispatch('MAKE_DEPOSIT', payload)
        .then(() => {
          vm.onPaymentFlow = false;
          vm.isSuccess = true;
        })
        .catch(() => {
          vm.onPaymentFlow = false;
          vm.isSuccess = false;
        });
    },

    checkTransaction() {
      const vm = this;
      this.onPaymentFlow = true;
      this.$store
        .dispatch('GET_PAYMENT_STATUS', {
          id: vm.operationCode,
          bank: vm.selectedBank.code,
        })
        .then((r) => {
          if (r.data.status === 'success') {
            this.dispatch('SEND_APV_NOTIFICATION', { apv: this.apv, employer: this.employer }).then(() => {
              clearInterval(vm.checkTransactionState);
              vm.onPaymentFlow = false;
              vm.isSuccess = true;
            });
          } else if (
            vm.checkPaymentIteration >= vm.checkPaymentMaxTimes ||
            vm.paymentWindow.closed
          ) {
            clearInterval(vm.checkTransactionState);
            vm.onPaymentFlow = false;
            vm.isSuccess = false;
          }
        });
    },

    cancel() {
      window.location.reload();
    },
  },
};
</script>
<style lang="scss" scoped>
//colors
$seashell: #f1f1f1;
$color_mountain_mist_approx: #999;
$color_burgundy_approx: #9b0822;
$color_suva_gray_approx: #888;
$color_aqua_forest_approx: #579e78;

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
@media screen and(max-width: 768px) {
  .header-description-element {
    flex-direction: column;
    padding: 10px;
    align-items: center;
    justify-content: center;
  }
}
@media (max-width: 530px) {
  .header-description-element {
    flex-direction: column;
    justify-content: center;
  }
  .modal-title {
    line-height: 1;
    font-size: 18px;
    .response__icon {
      font-size: 3rem;
    }
  }
}
</style>
