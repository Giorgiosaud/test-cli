<template>
  <div class="modal-content bg-gris">
    <div class="modal-body row no-gutters p-noie-0 bg-gris">
      <div
        :class="{'col-md-5':accounts.length,'align-items-center':!accounts.length}"
        class="col-12  transaction-details px-4 pb-4">
        <h2
          v-if="accounts.length"
          class="mt-4">
          Abono desde Banco
        </h2>
        <div
          v-if="accounts.length"
          class="monto-aporte mt-5">
          <h3>Monto de <b>aporte</b></h3>
          <div
            v-if="!isTransferTo"
            class="monto-aporte--amount mb-5 text-right">{{ investedAmount|currency }}</div>
          <div
            v-else
            class="d-flex align-items-center pb-5">
            <div class="col-12 p-3 py-3 bg-white">
              <div class="inest_amount row no-gutters">
                <div class="col-md-5">
                  <p class="m-0 text-muted">Ingresar un <br> monto a invertir</p>
                </div>
                <div class="col-md-7">
                  <money
                    v-model.lazy="multiInvestAmount"
                    v-bind="moneyFormat"
                    placeholder="0"
                    class="text-right"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="loadingAccounts"
          class="d-flex align-items-center justify-content-center"><div class="loading-ico"/>
        </div>
        <div
          v-else-if="!accounts.length"
          class="selector-cuenta-destino">
          <h3>No posee <b>cuentas</b> disponibles para inversión</h3>
        </div>
        <div
          v-else
          class="selector-cuenta-destino">
          <h3>Selecciona la cuenta de <b>destino</b> del aporte</h3>
          <div class="selector-cuenta-destino--selector input-groupbox-amount-value">
            <select
              id=""
              v-model="selectedToNumber"
              name=""
              class="form-control">
              <option :value="null">Seleccione la cuenta</option>
              <option
                v-for="(account, index) in availablesAccounts"
                :key="index"
                :value="account.number">{{ account.name }}</option>
            </select>
          </div>
        </div>

      </div>


      <div
        v-if="accounts.length"
        :class="{'box_disable':bankIsNotSelectable}"
        class="col-12 col-md-7 bank-selector ">
        <div class="m-3 p-3 bg-white bg-white">
          <div
            v-if="isGettingOperationCode"
            class="loader">
            <div class="d-flex align-items-center justify-content-center">
              <div class="loading-ico"/>
            </div>
          </div>
          <h2 class="mb-3">Seleccionar Banco</h2>
          <h4>Seleccione el banco desde el que desea transterir a LarrainVial</h4>
          <div class="row no-gutters mt-2 mb-3 box-bank">
            <div
              v-for="(bank,index) in banks"
              :key="index"
              class="col-6 col-md-4 p-1">
              <div class="bank-logo">
                <input
                  :name="bank.code"
                  :id="bank.code"
                  v-model="selectedBank"
                  :value="bank"
                  type="radio"
                  @change="selectBank">
                <label
                  :for="bank.code"
                  class="py-2">
                  <img
                    :src="bank.logo"
                    :alt="bank.name">
                </label>
              </div>
            </div>
          </div>
          <p><small>La Transferencia a su cuenta LarrainVial dependerá de los <a
            href="https://chile.larrainvial.com/2018/tiempos_banco/"
            target="_blank">horarios especificados.</a></small></p>
        </div>
      </div>
    </div>
    <div
      v-if="!isTransferTo"
      class="modal-footer justify-content-between top-shadow p-3 p-md-4 reverse">
      <button
        type="button"
        class="btn btn-link text-left mr-auto"
        @click="cancel">Cancelar
      </button>
      <div class="">

        <button
          :disabled="isButtonDisabled"
          :class="{disabled:isButtonDisabled}"
          type="button"
          class="btn btn-primary btn-block"
          @click="goToBankFlow">Continuar
        </button>
      </div>
    </div>
    <div
      v-else-if="accounts.length"
      class="container text-right my-3">
      <button
        :disabled="isButtonDisabled"
        :class="{disabled:isButtonDisabled}"
        type="button"
        class="btn btn-primary m-0"
        @click="goToBankFlow">Transferir<i class="mdi mdi-chevron-right"/>
      </button>
    </div>
  </div>
</template>

<script>
import { banks, moneyFormat } from '../../variables';

export default {
  props: {
    isTransferTo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      moneyFormat,
      banks,
      gettingOperationCode: false,
      url: 'https://www.larrainvial.com/',
      isGettingOperationCode: false,
    };
  },
  computed: {
    multiInvestAmount: {
      get() {
        return this.$store.state.multiInvestAmount;
      },
      set(val) {
        this.$store.commit('SET_MULTI_INVEST_AMOUNT', val);
      },
    },
    paymentWindow: {
      get() {
        return this.$store.state.paymentWindow;
      },
      set(window) {
        this.$store.commit('SET_PAYMENT_WINDOW', window);
      },
    },

    accounts() {
      return this.$store.state.accounts;
    },
    availablesAccounts() {
      return this.accounts.filter((acc) => {
        if (Object.prototype.hasOwnProperty.call(acc, 'available')) { return acc.available === true; }
        return true;
      });
    },
    loadingAccounts() {
      return this.$store.state.loadingAccounts;
    },
    selectedBank: {
      get() {
        return this.$store.state.selectedBank;
      },
      set(bank) {
        return this.$store.commit('SET_SELECTED_BANK', bank);
      },
    },
    selectedToAccount() {
      return this.$store.state.selectedToAccount;
    },
    selectedToNumber: {
      get() {
        return !this.selectedToAccount ? null : this.selectedToAccount.number;
      },
      set(number) {
        const account = _.find(this.accounts, { number });
        this.$store.commit('SET_SELECTED_TO_ACCOUNT', account);
      },
    },
    investmentList() {
      return this.$store.getters.investmentList;
    },
    isButtonDisabled() {
      return !this.operationCode;
    },
    operationCode() {
      return this.$store.state.operationCode;
    },
    bankIsNotSelectable() {
      return !this.selectedToAccount || this.gettingOperationCode || this.multiInvestAmount <= 0;
    },
    rut() {
      return this.$store.state.rut;
    },
    banco() {
      return this.selectedBank.name;
    },
    investedAmount() {
      return this.$store.getters.investedAmount;
    },
    rutValidator() {
      return this.$store.state.rutValidator;
    },
    serviceURL() {
      return this.url + this.service;
    },
    paramsBase() {
      return `?strCodOp=${this.operationCode}&strRUT=${this.rut}&strCuenta=${this.selectedToAccount.number}`;
    },
    paramMonto() {
      return `&strMonto=${this.investedAmount}`;
    },
    paramDv() {
      return `&strDV=${this.rutValidator}`;
    },
    paramNew() {
      return '&NewSitioPrivado=true';
    },
    paramsBCI() {
      return `Ident=Abono_Banco_BCI&monto=${this.investedAmount}&pagret=http://www.larrainvial.com/SitioPrivado/cliente/PagoElectronico/DetalleAbonoV2.asp&costo=0&banco=bci&trx=${this.operationCode}&UrlPreIngreso=https://www.bci.cl/pagoswls/PagueDirecto?paso=5&Convenio=14934`;
    },
    service() {
      let service;
      switch (this.selectedBank.code) {
        case 'CHILE':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoChile.asp${this.paramsBase}`;
          break;
        case 'BBVA':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoBBVA.asp${this.paramsBase}${this.paramMonto}`;
          break;
        case 'BCI':
          service = 'sitioprivado/Transferencias/trxInicioBancoBCITBANC.aspX';
          if (navigator.appName !== 'Microsoft Internet Explorer') {
            service = 'sitioprivado/Transferencias/trxInicioBancoBCITBANC2.asp';
          }
          service += `?${this.paramsBCI}`;
          break;
        case 'BICE':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoBICE.asp${this.paramsBase}${this.paramMonto}`;
          break;
        case 'ESTADO':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoEstado.asp${this.paramsBase}${this.paramMonto}${this.paramDv}${this.paramNew}`;
          break;
        case 'SANTANDER':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoSantanderSantiago.asp${this.paramsBase}${this.paramMonto}`;
          break;
        case 'ITAU':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoItau.asp${this.paramsBase}${this.paramMonto}`;
          break;
        case 'SCOTIA':
          service = `LVCliente/Transferencias/trxASP/trxInicioScotiaBank.asp${this.paramsBase}${this.paramMonto}`;
          break;
        case 'EDWARDS':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoChileEDC.asp${this.paramsBase}${this.paramMonto}`;
          break;
        default:
          service = false;
      }
      return service;
    },
  },
  watch: {
    selectedToAccount(from, to) {
      if (from !== to) {
        this.$store.commit('SET_OPERATION_CODE', null);
      }
      this.$store.commit('SET_SELECTED_BANK', null);
    },
  },
  methods: {
    goToBankFlow() {
      const vm = this;
      const paymentWindow = window.open(
        vm.serviceURL,
        '_blank',
        'sandbox, dependent=1, toolbar=0, titlebar=0, location=0, directories=0, status=0, menubar=0, scrollbars=1, resizable=1, width=700, centerscreen=1, chrome=yes, height=475',
        true,
      );
      vm.$store.commit('SET_PAYMENT_WINDOW', paymentWindow);
      vm.$store.commit('SET_MODAL_COMPONENT', 'invest-voucher');
    },
    selectBank() {
      if (!this.operationCode) {
        this.gettingOperationCode = true;
        if (this.isTransferTo) {
          this.createPayment()
            .then((r) => {
              this.$store.commit('SET_OPERATION_CODE', r.id);
              this.$store.commit('SET_RUT', r.rut.split('-')[0]);
              this.$store.commit('SET_RUT_VALIDATOR', r.rut.split('-')[1]);
            })
            .catch((err) => {
              this.selectedBank = null;
              sendPopup(
                'warning',
                transactionalMessages.mutualFunds.couldNotCreateOperationsCode,
              );
              throw err;
            })
            .finally(() => {
              this.gettingOperationCode = false;
            });
        } else {
          this.createPayment()
            .then((r) => {
              this.$store.commit('SET_OPERATION_CODE', r.operationCode);
              this.$store.commit('SET_RUT', this.rut.split('-')[0]);
              this.$store.commit('SET_RUT_VALIDATOR', this.rut.split('-')[1]);
            })
            .catch((err) => {
              this.selectedBank = null;
              sendPopup(
                'warning',
                transactionalMessages.mutualFunds.couldNotCreateOperationsCode,
              );
              throw err;
            })
            .finally(() => {
              this.gettingOperationCode = false;
            });
        }
      }
    },
    createPayment() {
      if (this.isTransferTo) {
        const payload = {
          accountNumber: this.selectedToAccount.number,
          amount: this.multiInvestAmount.toString(),
        };
        this.isGettingOperationCode = true;
        return this.$store.dispatch('POST_PAYMENT', payload).then(r => r).finally(() => {
          this.isGettingOperationCode = false;
        });
      }
      const transactions = _.map(this.investmentList, (invest) => {
        const investmap = invest;
        investmap.amount = investmap.amount.toString();
        return investmap;
      });
      const payload = {
        accountNumber: this.selectedToAccount.number,
        transactions,
      };
      this.isGettingOperationCode = true;
      return this.$store.dispatch('POST_PAYMENT', payload).finally(() => {
        this.isGettingOperationCode = false;
      });
    },
    cancel() {
      $('#modal').modal('hide');
    },
  },
};
</script>
<style lang="scss" scoped>
.selector-cuenta-destino {
  display: flex;
  justify-content: start;
  flex-direction: column;
}
.transaction-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.monto-aporte--amount {
  font-size: 26px;
  font-weight: bold;
}
select.form-control:not([size]):not([multiple]) {
  height: 70px;
}
.monto-aporte h3,
.selector-cuenta-destino h3 {
  font-size: 20px;
}
.select-account-box .select-box select {
  padding: 10px;
  border: 1px solid #ddd;
}
.bank-logo label {
  display: block;
  margin: 0;
  cursor: pointer;
  border: 1px solid #eee;
  transition: all 0.5s;
}
.bank-logo input {
  height: 1px;
  width: 1px;
  position: absolute;
  top: -20px;
  opacity: 0;
}
.bank-logo input[type="radio"]:checked + label {
  /*border-color: red;*/
  border: 1px solid red;
  border-radius: 3px;
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.box-banks {
  position: relative;
  /*background: #f7f9fc;*/
  padding-top: 0.75rem !important;
}
.ie11 .border-bottom-dotted,
.border-bottom-solid {
  border-bottom: solid 1px #c5c5c5;
}
.box-banks__title {
  font-style: italic;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.box-amount {
  position: relative;
}
.bank-logo img {
  max-width: 100%;
}
.box_disable {
  opacity: 0.5;
  pointer-events: none;
}
.select-account-box {
  background: #f4f4f4;
}
.loader {
  position: absolute;
  left: 0;
  z-index: 100;
  height: 100%;
  width: 100%;
  background: #ffffff96;
  display: block;
  margin: auto;
}
.inest_amount input {
  border: none;
  height: 30px;
  font-size: 20px;
  width: 100%;
  border-bottom: solid 1px #616161;
  padding-bottom: 13px;
  color: #616161;
  background: none;
}
.inest_amount input:focus,
.select-box select:focus {
  outline: none;
}
.inest_amount p {
  line-height: 1.2em;
  font-size: 90%;
}
button.btn.btn-primary {
  border-radius: 0;
}
.btn-primary {
  font-size: 1.1rem;
}

.btn-primary.disabled,
.btn-primary:disabled {
  background: #f1f3f3;
  color: #ccc;
  opacity: 1;
  border-color: #f1f3f3;
}
.p-noie-0 {
  padding: 0 !important;
}
.ie11 .p-noie-0 {
  padding: inherit !important;
}
</style>
