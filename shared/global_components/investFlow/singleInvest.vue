<template>
  <div class="modal-content">
    <div class="modal-header bg-white text-dark bottom-shadow p-3 p-md-4">
      <div class="d-block w-100">
        <h3 class="modal-title col-12 text-muted">Aporte {{ type }}</h3>
        <h5 class="modal-subtitle col-12">
          <strong>{{ selectedFund.name }}</strong><span> – Serie {{ selectedFund.serie }}</span>
        </h5>
      </div>
    </div>
    <div class="modal-body">
      <div class="d-flex flex-column col-12 col-md-8 m-auto ma">
        <div class="d-flex align-items-center justify-content-center flex-column py-5">

          <div class="w-100">
            <div
              v-if="loadingAccounts"
              class="w-100 d-flex align-items-center justify-content-center pt-4">
              <div class="loading-ico"/>
            </div>
            <v-select
              v-else
              v-model="selectedFromAccountNumber"
              :options="originAccounts"
              :searchable="false"
              :clearable="false"
              class="select_accounts select_accounts--origin"
              label="name"
              index="number">
              <span slot="no-options">Cargando cuentas...</span>
            </v-select>
          </div>
        </div>
        <div class="d-flex align-items-center pb-5">
          <div class="col-12 p-0">
            <div
              :class="{error:errors.has('Monto a Invertir')}"
              class="inest_amount row no-gutters">
              <div class="col-12">
                <p class="m-0 text-muted">Ingresar un monto a invertir</p>
              </div>
              <div class="col-12">
                <money
                  v-validate="{required:true,between:[minInvestValue,maxToInvest]}"
                  v-model.lazy="multiInvestAmount"
                  v-bind="money"
                  :disabled="!canInvest"
                  name="Monto a Invertir"
                  placeholder="0"
                  class="text-right p-0"
                />
              </div>
              <div
                v-if="loadingAmount"
                class="w-100 text-right">
                <div class="loading-ico-xs max_to_invest_load"/>
              </div>
              <div
                v-else
                class="col-12 text-right pt-2">
                <div
                  class="my-2">
                  <span
                    v-if="selectedFromAccount && selectedFromAccount.type!=='bank'"
                    class="text-muted">
                    Caja disponible
                    <b>{{ selectedAccountBalance.accountBalanceString }}</b>
                  </span>
                  <div
                    v-else
                    class="my-2">
                    <span class="text-muted">
                      Máximo a invertir
                      <b>{{ maxInvestValue|currency }}</b>
                    </span>
                  </div>
                </div>
                <span
                  v-if="selectedAccountBalance &&
                    selectedFromAccount &&
                    selectedFromAccount.type !== 'bank' &&
                  parseInt(selectedAccountBalance.accountBalanceValue)<parseInt(minInvestValue,10)"
                  class="help is-danger"
                >Monto en caja insuficiente para invertir. El monto mínimo es de {{ minInvestValue|currency }}.</span>
                <span
                  v-else
                  v-show="errors.has('Monto a Invertir')"
                  class="help is-danger"
                  v-text="errors.first('Monto a Invertir')"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer justify-content-between top-shadow">
      <button
        type="button"
        class="btn btn-link text-left mr-auto"
        data-dismiss="modal">Cancelar</button>
      <button
        :disabled="!canGoNext"
        :class="{disabled:!canGoNext}"
        type="button"
        class="btn btn-primary text-center"
        @click="goToDepositFlow"
      >Continuar</button>
    </div>
  </div>
</template>

<script>
import { moneyFormat } from '../../variables';

export default {
  props: {
    type: {
      type: String,
      default: 'Fondos Mutuos',
    },
  },
  data() {
    return {
      loadingAmount: false,
      money: moneyFormat,
    };
  },
  computed: {
    originAccounts() {
      return this.$store.getters.originAccounts;
    },
    selectedFromAccount() {
      return this.$store.state.selectedFromAccount;
    },
    selectedFromAccountNumber: {
      get() {
        return !this.selectedFromAccount
          ? null
          : this.selectedFromAccount.number;
      },
      set(number) {
        const account = _.find(this.originAccounts, { number });
        this.$store.commit('SET_SELECTED_FROM_ACCOUNT', account);
        if (account.type === 'lv') {
          this.$store.commit('SET_SELECTED_TO_ACCOUNT', account);
        }
      },
    },
    selectedFund() {
      return this.$store.state.selectedFund;
    },
    multiInvestAmount: {
      get() {
        return this.$store.state.multiInvestAmount;
      },
      set(value) {
        this.$store.commit('SET_MULTI_INVEST_AMOUNT', value);
        const selectedFund = this.$store.state.mutualFundsToInvest
          .find(fund => fund.nemoSiga === this.selectedFund.nemoSiga);
        this.$set(selectedFund, 'amount', this.multiInvestAmount);
        if (value > 1) { this.$set(selectedFund, 'percentage', 100); } else { this.$set(selectedFund, 'percentage', 0); }
      },
    },
    selectedAccountBalance() {
      return this.$store.state.selectedAccountBalance;
    },
    maxInvestValue() {
      return this.$store.state.maxInvestValue;
    },
    loadingAccounts() {
      return this.$store.state.loadingAccounts;
    },
    minInvestValue() {
      return this.$store.state.minInvestValue;
    },
    maxToInvest() {
      if (
        !this.selectedFromAccount ||
          (this.selectedFromAccount.type !== 'bank' &&
            !this.selectedAccountBalance)
      ) {
        return false;
      }
      if (this.selectedFromAccount.type === 'bank') {
        return this.maxInvestValue;
      }
      return Math.min(
        parseInt(this.maxInvestValue, 10),
        parseInt(this.selectedAccountBalance.accountBalanceValue, 10),
      );
    },
    canInvest() {
      if (
        this.selectedFromAccount &&
          this.selectedFromAccount.type === 'bank'
      ) {
        return true;
      } else if (this.selectedFromAccount && this.selectedAccountBalance) {
        if (this.selectedAccountBalance.accountBalanceValue > 0) return true;
      }
      return false;
    },
    canGoNext() {
      return !(this.multiInvestAmount > this.maxToInvest ||
          this.multiInvestAmount < this.minInvestValue);
    },
  },
  watch: {
    selectedFromAccount(account) {
      this.$store.commit('SET_SELECTED_ACCOUNT_BALANCE', null);
      if (account.type === 'lv') {
        this.loadingAmount = true;
        this.$store
          .dispatch('GET_SELECTED_ACCOUNT_BALANCE', {
            accountNumber: account.number,
          })
          .finally(() => {
            this.loadingAmount = false;
          });
      } else {
        this.loadingAmount = false;
      }
    },
  },
  created() {
    if (this.originAccounts.length === 1) {
      this.$store.commit('SET_LOADING_ACCOUNTS', true);
      this.$store.dispatch('GET_ACCOUNTS').then(() => {
        this.$store.commit('SET_LOADING_ACCOUNTS', false);
      });
    }
  },
  methods: {
    goToDepositFlow() {
      this.$store.commit('SET_MODAL_COMPONENT', 'invest-confirmation');
    },
  },
};
</script>
<style lang="scss" >
  //colors
  $color_storm_dust_approx: #636363;
  $color_storm_dust_approx: #616161;
  $color_concrete_approx: #f1f3f3;
  $color_carmine_approx: #9b0821;
  $color_mine_shaft_approx: #333;
  $black_26: rgba(0, 0, 0, 0.26);
  $black_15: rgba(0, 0, 0, 0.15);
  $white: #fff;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  %select_open_arrow {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid;
    transform: none;
  }
  .max_to_invest {
    text-align: right;
    position: absolute;
    top: 100%;
    margin-top: 10px;
  }
  .select_accounts {
    &.dropdown.v-select .dropdown-toggle {
      color: $color_storm_dust_approx;
      background: $color_concrete_approx;
      border: 0;
      border-radius: 0;
      min-height: 56px;
    }
    &.v-select .dropdown-toggle {
      cursor: pointer;
      padding: 15px 15px 0 0;
    }
  }
  .v-select {
    &.select_accounts {
      &.open {
        input[type="search"] {
          position: absolute !important;
        }
        .open-indicator:before {
          transform: rotate(180deg);
        }
      }
      .vs__selected-options {
        position: unset;
      }
      .selected-tag {
        font-size: 16px;
      }
      .vs__actions {
        display: block;
        padding: 5px 5px 0 0 !important;
      }
      .dropdown-menu {
        border: none;
        margin: 0;
        padding: 0;
        border-top: $color_concrete_approx 1px solid;
        > .highlight > a {
          background: $color_carmine_approx;
        }
      }
      .open-indicator:before {
        @extend %select_open_arrow;
      }
    }
    .dropdown-menu {
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
      min-width: 160px;
      padding: 5px 0;
      margin: 0;
      width: 100%;
      overflow-y: scroll;
      border: 1px solid $black_26;
      box-shadow: 0 3px 6px 0 $black_15;
      border-top: none;
      border-radius: 0 0 4px 4px;
      text-align: left;
      list-style: none;
      background: $white;
    }
    .open-indicator:before {
      @extend %select_open_arrow;
    }
    &.open .open-indicator:before {
      transform: rotate(180deg);
    }
    &.single.open.select_accounts .selected-tag {
      position: relative;
    }
    li > a {
      display: block;
      padding: 3px 20px;
      clear: both;
      color: $color_mine_shaft_approx;
      white-space: nowrap;
    }
  }
  //colors

  .inest_amount {
    &.error {
      input {
        border-bottom: solid 1px $color_carmine_approx;
        color: $color_carmine_approx;
      }
    }
    input {
      border: none;
      height: 30px;
      font-size: 20px;
      width: 100%;
      border-bottom: solid 1px $color_storm_dust_approx;
      padding-bottom: 13px;
      color: $color_storm_dust_approx;
      background: none;
      &:focus {
        outline: none;
      }
    }
    p {
      line-height: 1.2em;
      font-size: 90%;
    }
  }
  .select-box select:focus {
    outline: none;
  }
  p {
    line-height: 1.2em;
    font-size: 90%;
  }
  .dropdown.v-select {
    &.select_accounts--origin.single.unsearchable:after {
      content: "Seleccione Origen de los fondos";
      position: absolute;
      left: 5px;
      top: 5px;
      color: $color_storm_dust_approx;
      z-index: 1000;
      display: block;
      height: 10px;
      width: 150px;
      font-size: 9px;
      visibility: visible;
      border: none;
    }
    &.select_accounts--destination.single.unsearchable:after {
      content: "Selecciona Destino";
      position: absolute;
      left: 5px;
      top: 5px;
      color: $color_storm_dust_approx;
      z-index: 1000;
      display: block;
      height: 10px;
      width: 150px;
      font-size: 9px;
      visibility: visible;
      border: none;
    }
  }
  .ie11 .loading-ico-xs {
    animation: none !important;
    display: none;
  }
  .loading-ico-xs {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #333;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    animation: spin 2s linear infinite;
  }
  .max_to_invest_load {
    text-align: right;
    position: absolute;
    top: 100%;
    margin-top: 10px;
    right: 0;
  }
  input:focus {
    outline: none;
  }
  .select-box select:focus {
    outline: none;
  }
  @media screen and (max-width: 768px) {
    .modal-content {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      .modal-header {
        flex: 1;
        z-index: 1;
        display: block;
      }
      .modal-body {
        height: 100%;
      }
      .modal-footer {
        min-height: 60px;
      }
    }
  }
</style>
