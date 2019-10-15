<template>
  <div class="modal-content bg-gris">
    <div class="modal-body row no-gutters p-noie-0 bg-gris">
      <div
        class="col-12 col-md-5 transaction-details px-4 pb-4">
        <h2
          class="mt-4">
          Abono desde Banco
        </h2>
        <div
          class="monto-aporte mt-5">
          <h3>Monto de <b>aporte</b></h3>
          <div
            class="monto-aporte--amount mb-5 text-right">{{ investedAmount|currency }}
          </div>
        </div>
      </div>
      <div
        :class="{'box_disable':bankIsNotSelectable}"
        class="col-12 col-md-7 bank-selector ">
        <div class="p-3 bg-white bg-white">
          <div
            v-if="gettingOperationCode"
            class="loader d-flex align-items.center justify-content-center">
            <div class="d-flex align-items-center justify-content-center">
              <div class="loading-ico"/>
            </div>
          </div>
          <div>
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
                    :checked="bank.code===selectedBankCode"
                    type="radio"
                    @change="selectBank(bank)">
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
          </div>
          <p>
            <small>La Transferencia a su cuenta LarrainVial dependerá de los <a
              href="https://chile.larrainvial.com/2018/tiempos_banco/"
              target="_blank">horarios especificados.</a></small>
          </p>
        </div>
      </div>
    </div>
    <div
      class="modal-footer justify-content-between top-shadow p-3 p-md-4 reverse">
      <button
        type="button"
        class="btn btn-link text-left mr-auto"
        @click="cancel">Cancelar
      </button>
      <div>
        <button
          :disabled="isButtonDisabled"
          :class="{disabled:isButtonDisabled}"
          type="button"
          class="btn btn-primary btn-block"
          @click="goToBankFlow">Continuar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { moneyFormat } from '../../../shared/variables';
import bankFlowLogic from '../../../shared/mixins/bankFlowLogic';

export default {
  name: 'InvestFromBank',
  mixins: [bankFlowLogic],
  data() {
    return {
      gettingOperationCode: false,
      moneyFormat,

    };
  },
  computed: {
    selectedToAccountNumber() {
      return this.apv.regime === 'A' ? 86 : 83;
    },
    investedAmount() {
      return this.$store.getters.investedAmount;
    },
    bankIsNotSelectable() {
      return this.gettingOperationCode;
    },
    isButtonDisabled() {
      return !this.transferId || !this.selectedBankCode;
    },
    apv() {
      return this.$store.state.apv;
    },
    employer() {
      return this.$store.state.employer;
    },
  },
  methods: {
    selectBank(bank) {
      this.$store.commit('SET_SELECTED_BANK_CODE', bank.code);
      this.getOperationCode();
    },
    getOperationCode() {
      this.gettingOperationCode = true;
      this.$store.commit('SET_OPERATION_CODE', '');
      const apv = { apv: _.pickBy(this.apv) };
      this.$store.dispatch('SEND_CONTRACT', apv)
        .then((response) => {
          this.$store.commit('SET_OPERATION_CODE', response.data.data.idTransaction);
          this.$store.commit('SET_NUMERO_DE_FOLIO', response.data.data.folio);
        })
        .catch((error) => {
          this.selectedBank = {};
          sendPopup(
            'warning',
            transactionalMessages.mutualFunds.couldNotCreateOperationsCode,
          );
          throw error;
        })
        .finally(() => {
          this.gettingOperationCode = false;
        });
    },
    goToBankFlow() {
      this.openBankWindow();
      this.$store.commit('SET_MODAL_COMPONENT', 'invest-voucher');
      this.$store.commit('SET_INVESTING_FROM_BANK', true);
    },
    cancel() {
      $('#modal')
        .modal('hide');
    },
  },

};
</script>
<style lang="scss" scoped>
@import "../../../shared/styles/investbankFlow";
</style>
