<template>
  <div class="modal-content">
    <div class="modal-header bg-white text-dark bottom-shadow p-3 p-md-4">
      <div class="d-block w-100">
        <h3 class="modal-title col-12 text-muted">Rescate Fondo Mutuo</h3>
        <h5 class="modal-subtitle col-12">
          <strong>{{ selectedFund.name }}</strong>
          <span> – Serie {{ selectedFund.serie }}</span>
        </h5>
      </div>
    </div>
    <div class="modal-body">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <v-select
              v-model="selectedInvestmentAccountNumber"
              :options="selectedFund.accounts"
              :searchable="false"
              :clearable="false"
              class="select_accounts select_accounts--origin"
              label="name"
              index="number">
              <span slot="no-options">Cargando cuentas...</span>
            </v-select>
          </div>
          <div
            v-if="selectedInvestmentAccount"
            class="col-12 py-4">
            <div>
              <h3 class="mb-0">{{ selectedFundMaxToRescue.availableAmount.originValue|currency }}</h3>
              <small class="text-muted mb-0">Máximo a Rescatar</small>
            </div>
          </div>
          <div
            v-else
            class="col-12 py-4">
            <div>
              <h3 class="mb-0 text-muted">Seleccione una Cuenta de Origen</h3>
              <small class="text-muted mb-0 invisible">Máximo a Rescatar</small>
            </div>
          </div>
          <div class="col-12">
            <div
              :class="{error:errors.has('Monto a Rescatar')}"
              class="inest_amount row no-gutters">
              <div class="col-12">
                <p class="m-0 text-muted">Ingresar un <br> monto a rescatar</p>
              </div>
              <div class="col-12">
                <money
                  v-validate="{required:true,between:[0,maxAmountToRescue]}"
                  v-model.lazy="singleRescueAmount"
                  v-bind="money"
                  :disabled="!canRescue"
                  name="Monto a Rescatar"
                  placeholder="0"
                  class="text-right"
                />
                <span
                  v-show="errors.has('Monto a Rescatar')"
                  class="help is-danger"
                  v-text="errors.first('Monto a Rescatar')"/>
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
        @click="goToWithdrawFlow"
      >Continuar</button>
    </div>
  </div>
</template>

<script>
import { moneyFormat } from '../../variables';

export default {
  data() {
    return {
      loadingAmount: false,
      money: moneyFormat,
      singleRescueAmount: '',
    };
  },
  computed: {
    selectedFund() {
      return this.$store.state.selectedFund;
    },
    investmentAccounts() {
      return this.$store.getters.investmentAccounts;
    },
    selectedInvestmentAccount() {
      return this.$store.state.selectedInvestmentAccount;
    },
    selectedInvestmentAccountNumber: {
      get() {
        return !this.selectedInvestmentAccount
          ? null
          : this.selectedInvestmentAccount.number;
      },
      set(number) {
        const account = _.find(this.investmentAccounts, { number });
        this.$store.commit('SET_SELECTED_INVESTMENT_ACCOUNT', account);
      },
    },
    canRescue() {
      return !!this.selectedInvestmentAccount;
    },
    canGoNext() {
      if (!this.selectedFundMaxToRescue || this.singleRescueAmount > this.maxAmountToRescue) {
        return false;
      }
      const canGo = (
        !!this.selectedInvestmentAccount &&
        this.selectedInvestmentAccount.availableAmount.value > this.singleRescueAmount &&
        this.singleRescueAmount > 0 &&
        this.singleRescueAmount <= this.maxAmountToRescue
      );
      if (this.singleRescueAmount > this.maxAmountToRescue) {
        this.$emit('exceedsWithdrawAmount');
      }
      return canGo;
    },
    selectedFundMaxToRescue() {
      const vm = this;
      if (!this.selectedInvestmentAccountNumber) {
        return null;
      }
      const accounts = _.find(
        this.selectedFund.accounts,
        account => account.number === vm.selectedInvestmentAccountNumber,
      );
      return accounts;
    },
    maximumWithdrawal() {
      return this.$store.state.maximumWithdrawal;
    },
    maxAmountToRescue() {
      const val = this.selectedFundMaxToRescue ? this.selectedFundMaxToRescue.availableAmount.originValue : 0;
      return Math.min(parseInt(this.maximumWithdrawal, 10), parseInt(val, 10));
    },
  },
  methods: {
    goToWithdrawFlow() {
      this.$set(this.selectedFund, 'amount', this.singleRescueAmount);
      if (this.singleRescueAmount > 1) { this.$set(this.selectedFund, 'percentage', 100); } else { this.$set(this.selectedFund, 'percentage', 0); }
      return this.$store.commit(
        'SET_MODAL_COMPONENT',
        'select-destination-account',
      );
    },
  },
};
</script>
<style lang="scss" >
$color_storm_dust_approx: #636363;
$color_concrete_approx: #f1f3f3;
$color_carmine_approx: #9b0821;
$color_mine_shaft_approx: #333;
$black_26: rgba(0, 0, 0, 0.26);
$black_15: rgba(0, 0, 0, 0.15);
$white: #fff;
%select_open_arrow {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid;
  transform: none;
}
p {
  line-height: 1.2em;
  font-size: 90%;
}
input:focus {
  outline: none;
}
.select-box select:focus {
  outline: none;
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
