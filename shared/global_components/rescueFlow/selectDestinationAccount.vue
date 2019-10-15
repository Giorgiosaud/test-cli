<template>
  <div class="modal-content">
    <div class="modal-header dotted-bottom">
      <h3 class="p-3 modal-title"><b>Rescate Fondos Mutuos</b></h3>
    </div>
    <div class="modal-body p-0">
      <div class="header-description">
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Origen</div>
            <div class="header-description-value">{{ selectedInvestmentAccount.name }}</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">Monto Total</div>
            <div class="header-description-value">{{ withdrawalAmount|currency }}</div>
          </div>
        </div>
      </div>
      <div class="selectorDeCuenta">
        <div class="col-10 mx-auto py-4">
          <v-select
            v-model="selectedDestinationAccountNumber"
            :options="destinationAccounts"
            :searchable="false"
            :clearable="false"
            max-height="150px"
            class="select_accounts select_accounts--destination"
            index="accountNumber">
            <span
              slot="no-options"
              class="py-3">Cargando cuentas...</span>
            <template
              slot="option"
              slot-scope="option">
              <span v-if="option.type=='bank'">
                {{ option.accountName }} / {{ option.accountNumber }}
              </span>
              <span v-else>
                {{ option.accountName }}
              </span>
            </template>
          </v-select>
        </div>
      </div>
      <div class="terms container">
        <p>
          La comunicación que UD. ha efectuado a través del sitio web constituye
          confirmación por escrito para los efectos dispuestos en el literal c) del numeral
          4 de la letra A.1. de la Norma de Carácter General Nº12 de la Superintendencia de
          Valores y Seguros y de conformidad a lo indicado en su Ficha de Cliente.
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
          :disabled="!canWithdraw"
          type="button"
          class="btn btn-primary btn-block"
          @click="confirmWithdraw">Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingAccounts: true,
    };
  },
  computed: {
    selectedInvestmentAccount() {
      return this.$store.state.selectedInvestmentAccount;
    },
    withdrawalAmount() {
      return this.$store.getters.withdrawalAmount;
    },
    simpleMode() {
      return this.$store.state.simpleMode;
    },
    destinationAccounts() {
      return this.$store.state.destinationAccounts;
    },
    selectedDestinationAccount() {
      return this.$store.state.selectedDestinationAccount;
    },
    selectedDestinationAccountNumber: {
      get() {
        return (!this.destinationAccounts) ? null : this.destinationAccounts.accountNumber;
      },
      set(number) {
        const account = _.find(this.destinationAccounts, { accountNumber: number });
        this.$store.commit('SET_SELECTED_DESTINATION_ACCOUNT', account);
      },
    },
    canWithdraw() {
      return !!this.selectedDestinationAccount;
    },
  },
  created() {
    const vm = this;
    this.$store.dispatch('GET_DESTINATION_ACCOUNTS').finally(() => {
      vm.loadingAccounts = false;
    });
  },
  methods: {
    confirmWithdraw() {
      this.$store.commit('SET_MODAL_COMPONENT', 'withdrawal-confirmation');
    },
    modifyBankWithdrawal() {},
    cancel() {
      $('#modal').modal('hide');
    },
  },
};
</script>
<style lang="scss" scoped>
$seashell: #f1f1f1;

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
@media (max-width: 530px) {
  .header-description-element {
    flex-direction: column;
    justify-content: center;
  }
}
</style>
