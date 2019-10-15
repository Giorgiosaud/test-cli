<template>
  <div class="modal-content">
    <div class="modal-header bg-white text-dark bottom-shadow p-3 p-md-4">
      <div class="d-block w-100">
        <h3 class="modal-title col-12 text-muted">Aporte {{ type }}</h3>
        <h5 class="modal-subtitle col-12">
          <strong>{{ selectedFundLiteral.name }}</strong><span> – Serie {{ selectedFundLiteral.serie }}</span>
        </h5>
      </div>
    </div>
    <div class="modal-body">
      <div
        v-if="contractType!=='DD' && systematicDiscountType==='temporal'"
        class="d-flex align-items-center justify-content-center flex-column py-3">
        <div
          class="w-100 monthpicker-container monthpicker-container with-input">
          <div class="monthpicker-trigger">
            <p class="mb-0 mr-3">Fechas del descuento:</p>
            <label class="input-group">
              <div class="input-group-addon">
                <i class="mdi mdi-calendar"/>
              </div>
              <input
                id="monthpicker-input-trigger"
                :value="formatMonths(dates)"
                type="text"
                placeholder="Seleccionar Fecha"
                class="form-control date-picker mb-0"
                readonly>
            </label>
            <monthpick-it
              :trigger-element-id="'monthpicker-input-trigger'"
              v-model="datesFilters"
              :min-month="minFromDate"
              :max-month="maxToDate"
              :years-to-show="2"
              :show-action-buttons="true"
              :offset-y="20"
              :mode="modeTranslation"
              :mobile-header="mobileHeaderText"
              readonly="true"
              @apply="applyMethod"
              @closed="closedMethod"
            />
          </div>
        </div>
        <div class="form-check ">
          <input
            id="is-single"
            v-model="isSingle"
            class="form-check-input"
            type="checkbox">
          <label
            class="form-check-label"
            for="is-single">Seleccionar solo un més</label>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-center flex-column py-5">
        <v-select
          v-model="amountType"
          :options="discountTypes"
          :searchable="false"
          :clearable="false"
          class="select_format_2 select_format_2--amount_type w-100"
          index="id">
          <span slot="no-options">Cargando Tipos de inversion</span>
        </v-select>
      </div>
      <div class="d-flex align-items-center pb-5">
        <div class="col-12 p-0">
          <div
            :class="{error:errors.has('Monto a Invertir')}"
            class="inest_amount row no-gutters">
            <div
              :class="{'bg-clean-gray':!canInvest}"
              class="col-12">
              <p class="m-0 text-muted">Ingresar un monto a invertir</p>
            </div>
            <div class="col-12">
              <input
                v-model="totalInvestAmountText"
                :disabled="!canInvest"
                type="text"
                placeholder="0"
                class="text-right form-control"
                @focus="removeFormat"
                @blur="addFormat"
              >
            </div>
            <div
              v-if="amountType"
              class="col-12 text-right pt-2">
              <div
                class="my-2">
                <div
                  class="my-2">
                  <span class="text-muted">
                    Máximo a invertir
                    <b>{{ maxToInvestText }}</b>
                  </span>
                </div>
              </div>
              <span
                v-show="errors.has('Monto a Invertir')"
                class="help is-danger"
                v-text="errors.first('Monto a Invertir')"/>
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
        :disabled="disableInvestButon"
        :class="{disabled:disableInvestButon}"
        type="button"
        class="btn btn-primary text-center"
        @click="goToDepositFlow"
      >Continuar</button>
    </div>
  </div>
</template>

<script>
import { moneyFormat, ufFormat, percentageFormat } from '../../../shared/variables';

export default {
  props: {
    type: {
      type: String,
      default: 'Fondos Mutuos',
    },
  },
  data() {
    return {
      isSingle: false,
      loadingAmount: false,
      money: moneyFormat,
      maxToDate: null,
      monthFormat: 'MM/YYYY',
      datesFilters: ['', ''],
      totalInvestAmountText: '',
    };
  },
  computed: {
    minFromDate() {
      if (moment().isBefore(moment().date(15).hour(0).minutes(0)
        .seconds(0))) {
        return moment().day(1).toDate();
      }
      return moment().add(1, 'months').day(1).toDate();
    },
    modeTranslation() {
      return this.isSingle ? 'single' : 'range';
    },
    mobileHeaderText() {
      return this.isSingle ? 'Seleccione el Mes' : 'Seleccione un rango de meses';
    },
    selectedFundLiteral() {
      return this.$store.state.selectedFund;
    },
    selectedFund() {
      return this.$store.state.mutualFundsToInvest.find(fund => fund.nemo === this.selectedFundLiteral.nemo);
    },
    contractType() {
      return this.$store.state.apv.subscriptionType;
    },
    systematicDiscountType() {
      return this.$store.state.discountType;
    },
    dates: {
      get() {
        return this.$store.getters.dates;
      },
      set(dates) {
        this.$store.commit('SET_DATES', dates);
      },
    },
    format() {
      switch (this.amountType) {
        case 'uf':
          return ufFormat;
        case 'clp':
          return moneyFormat;
        case 'income_percentage':
          return percentageFormat;
        default:
          return moneyFormat;
      }
    },
    selectedSuscriptionType() {
      return this.$store.state.apv.subscriptionType;
    },
    selectedRegime() {
      return this.$store.state.apv.regime;
    },
    bounders() {
      if (this.selectedRegime) {
        return this.$store.state.bounders[this.selectedSuscriptionType][this.selectedRegime];
      }
      return this.$store.state.bounders[this.selectedSuscriptionType];
    },
    discountTypes() {
      return this.$store.state.discountTypes;
    },
    amountType: {
      get() {
        return this.$store.state.apv.amountType;
      },
      set(discount) {
        return this.$store.commit('SET_SELECTED_AMOUNT_TYPE', discount);
      },
    },
    totalInvestAmount: {
      get() {
        return this.$store.state.apv.amount;
      },
      set(value) {
        this.$store.commit('SET_TOTAL_INVEST_AMOUNT', value);
      },
    },
    selectedAccountBalance() {
      return this.$store.state.selectedAccountBalance;
    },
    loadingAccounts() {
      return this.$store.state.loadingAccounts;
    },
    canInvest() {
      return !!this.amountType;
    },
    canGoNext() {
      return false;
    },
    maxInvestValue() {
      return this.bounders.max;
    },
    minInvestValue() {
      return this.bounders.min;
    },
    income() {
      return this.$store.state.apv.income;
    },
    totalAmountInvested() {
      switch (this.amountType) {
        case 'uf':
        case 'clp':
          return this.totalInvestAmount;
        case 'income_percentage':
          return (this.totalInvestAmount / 100) * this.income;
        default:
          return 0;
      }
    },
    maxToInvestText() {
      switch (this.amountType) {
        case 'uf':
          return this.maxInvestValue.originValueString;
        case 'income_percentage':
          return this.maxInvestValue.originValueString;
        case 'clp':
          return this.maxInvestValue.valueString;
        default:
          return '';
      }
    },
    discountType() {
      return this.$store.state.discountType;
    },
    investedAmount() {
      return this.$store.getters.investedAmount;
    },
    fromDate() {
      return this.$store.state.apv.fromDate;
    },
    endDate() {
      return this.$store.state.apv.endDate;
    },
    toInvestAmount() {
      return this.$store.getters.toInvestAmount;
    },
    disableInvestButon() {
      if (this.discountType === 'temporal' &&
              (this.endDate === '' ||
                      this.fromDate === '' ||
                      this.investedAmount === 0)) {
        return true;
      }
      switch (this.amountType) {
        case 'income_percentage':
          return this.investedAmount < 100;
        case 'uf':
          return this.toInvestAmount < 0;
        case 'clp':
          return this.toInvestAmount < 0;
        default:
          return true;
      }
    },
  },
  watch: {
    isSingle() {
      this.$store.commit('SET_DATES', ['', '']);
      this.datesFilters = ['', ''];
    },
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
  methods: {
    applyMethod() {
      this.dates = this.datesFilters;
    },
    closedMethod() {
      this.datesFilters = this.dates;
    },
    removeFormat() {
      if (this.totalInvestAmountText !== '') {
        switch (this.amountType) {
          case 'uf':
          case 'income_percentage':
            this.totalInvestAmountText = parseFloat(this.totalInvestAmountText.replace('.', '').replace(',', '.')).toString().replace(',', '').replace('.', ',');
            break;
          case 'clp':
          default: {
            const valueAmount = parseInt(this.totalInvestAmountText, 10);
            if (!Number.isNaN(valueAmount)) {
              this.totalInvestAmountText = valueAmount;
            } else if (this.totalInvestAmountText.split('$')[1]) {
              this.totalInvestAmountText = parseInt(this.totalInvestAmountText.split('$')[1].replace(/\./g, '').trim(), 10);
            } else {
              this.totalInvestAmountText = '';
            }
            break;
          }
        }
      }
    },
    addFormat() {
      switch (this.amountType) {
        case 'uf':
          this.totalInvestAmount = Math.round(parseFloat(this.totalInvestAmountText.replace('.', '')
            .replace(',', '.')) * 100) / 100;
          this.totalInvestAmountText = `${this.totalInvestAmount.toString().replace(',', '').replace('.', ',')} UF`;
          break;
        case 'income_percentage':
          this.totalInvestAmount = Math.round(parseFloat(this.totalInvestAmountText.toString().replace('.', '')
            .replace(',', '.')) * 100) / 100;
          this.totalInvestAmountText = `${this.totalInvestAmount.toString().replace(',', '').replace('.', ',')} %`;
          break;
        case 'clp':
        default: {
          this.totalInvestAmount = parseInt(this.totalInvestAmountText.toString().replace('.', '').replace(',', '.'), 10);
          const amountText = this.totalInvestAmount.toString();
          this.totalInvestAmountText = `$ ${amountText.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
          break;
        }
      }
      this.verifyAmount();
    },
    verifyAmount() {
      let isValidInvest = false;
      let maxToInvest = Infinity;
      let minToInvest = 0;
      switch (this.amountType) {
        case 'uf':
          maxToInvest = this.maxInvestValue.originValue;
          minToInvest = this.minInvestValue.originValue;
          isValidInvest = (this.totalAmountInvested >= minToInvest &&
                  this.totalAmountInvested <= maxToInvest);
          break;
        case 'clp':
          maxToInvest = this.maxInvestValue.value;
          minToInvest = this.minInvestValue.value;
          isValidInvest = (this.totalAmountInvested >= minToInvest &&
                  this.totalAmountInvested <= maxToInvest);
          break;
        case 'income_percentage':
          maxToInvest = this.maxInvestValue.value;
          minToInvest = this.minInvestValue.value;
          isValidInvest = (this.totalAmountInvested >= minToInvest &&
                  this.totalAmountInvested <= maxToInvest) && this.totalInvestAmount <= 100;
          break;

        default:
          isValidInvest = false;
          break;
      }
      // }
      if (isValidInvest) {
        const payload = {};
        payload.amount = this.totalAmountInvested;
        payload.amountType = this.amountType;
        payload.nemo = this.selectedFund.nemo;
        payload.percentage = 100;
        this.$store.commit('SET_FUND_DATA', payload);
        return;
      }

      switch (this.amountType) {
        case 'uf':
          sendPopupWithParams(
            'warning',
            _.clone(transactionalMessages.mutualFunds.investAmountOutOfBounders),
            {
              montoMaximo: this.$options.filters.currency(this.maxInvestValue.originValue, 'UF'),
              montoMinimo: this.$options.filters.currency(this.minInvestValue.originValue, 'UF'),
            },
          );
          break;
        case 'income_percentage':
          if (this.totalInvestAmount > 100) {
            sendPopup('warning', transactionalMessages.apv.exceedsPercentage);
          } else {
            sendPopupWithParams(
              'warning',
              _.clone(transactionalMessages.mutualFunds.investAmountOutOfBounders),
              {
                montoMaximo: this.$options.filters.currency(this.maxInvestValue.originValue, 'UF'),
                montoMinimo: this.$options.filters.currency(this.minInvestValue.originValue, 'UF'),
              },
            );
          }
          break;
        case 'clp':
        default:
          sendPopupWithParams(
            'warning',
            _.clone(transactionalMessages.mutualFunds.investAmountOutOfBounders),
            {
              montoMaximo: this.$options.filters.currency(maxToInvest),
              montoMinimo: this.$options.filters.currency(minToInvest),
            },
          );
          break;
      }
      this.totalInvestAmountText = '';
      this.totalInvestAmount = 0;
      this.selectedFund[this.amountType] = 0;
    },
    formatMonths(Dates) {
      let formattedDates = '';
      if (Dates[0]) {
        formattedDates = moment(Dates[0])
          .format(this.monthFormat);
      }
      if (Dates[1] && (!moment(Dates[0])
        .isSame(Dates[1], 'month'))) {
        formattedDates += ` - ${moment(Dates[1])
          .format(this.monthFormat)}`;
      }
      return formattedDates;
    },
    goToDepositFlow() {
      this.$store.commit('SET_APV_INVESTMENT_FUNDS', this.$store.getters.investmentList);
      this.$store.commit('SET_MODAL_COMPONENT', 'invest-confirmation');
    },
  },
};
</script>
<style lang="scss">
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
.select_format_2{
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
  &.select_format_2{
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
  &.single.open.select_format_2.selected-tag {
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
  &.select_format_2--amount_type.single.unsearchable:after {
    content: "Seleccione Tipo de Descuento";
    position: absolute;
    left: 5px;
    top: 5px;
    color: $color_storm_dust_approx;
    z-index: 10;
    display: block;
    height: 10px;
    width: 150px;
    font-size: 9px;
    visibility: visible;
    border: none;
  }
  &.select_format_2--destination.single.unsearchable:after {
    content: "Selecciona Destino";
    position: absolute;
    left: 5px;
    top: 5px;
    color: $color_storm_dust_approx;
    z-index: 10;
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
.bg-clean-gray{
  background:#f1f3f3;
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
