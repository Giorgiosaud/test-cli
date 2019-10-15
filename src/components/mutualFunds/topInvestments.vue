<template>
  <div id="top-aporte">
    <div class="row align-items-center justify-content-end w-100">
      <div
        v-if="contractType!=='DD' && systematicDiscountType==='temporal'"
        class="col-12 col-lg-4 form-group mb-0">
        <div
          class="w-100 monthpicker-container monthpicker-container with-input">
          <div class="monthpicker-trigger">
            <p class="mb-0 mr-3">Período:</p>
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
      <div
        v-if="contractType!=='DD'"
        class="col-6 col-lg-4 form-group">
        <div
          class="row">
          <label
            for="RentaImponible"
            class="col-12">
            Tipo de descuento
          </label>
          <div
            class="col-12"
            @click="totalInvestAmount = 0">
            <v-select
              v-model="amountType"
              :options="discountTypes"
              :searchable="false"
              :clearable="false"
              class="select-discount"
              index="id">
              <span slot="no-options">Cargando Tipos de inversion</span>
            </v-select>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-4 form-group">
        <div
          :class="{wait:!amountType}"
          class="row"
        >
          <label
            for="RentaImponible"
            class="col-12">
            Ingresar un monto a invertir
          </label>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { moneyFormat, ufFormat, percentageFormat } from '../../../shared/variables';

export default {
  data() {
    return {
      isSingle: false,
      loadingAmount: false,
      maxToDate: null,
      monthFormat: 'MM/YYYY',
      datesFilters: ['', ''],
      totalInvestAmountText: '',
    };
  },
  computed: {
    minFromDate() {
      if (moment().isBefore(moment().date(16).hour(0).minutes(0)
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
    bounders() {
      if (this.selectedRegime) {
        return this.$store.state.bounders[this.selectedSuscriptionType][this.selectedRegime];
      }
      return this.$store.state.bounders[this.selectedSuscriptionType];
    },
    suggested() {
      if (this.contractType === 'DD') {
        return this.$store.state.bounders.DD.suggested[this.selectedRegime].max;
      } else if (this.contractType === 'DC') {
        // TODO fix en api para que no se sub seleccione regimen en este tipo de deposito
        return this.$store.state.bounders.DC.suggested.max || this.$store.state.bounders.DC.suggested.A.max;
      }
      return null;
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
    labelInvestType() {
      switch (this.amountType) {
        case 'uf':
          return 'Ingrese monto a invertir';
        case 'clp':
          return 'Ingrese monto a invertir';
        case 'income_percentage':
          return 'Ingrese porcentaje de renta a invertir';
        default:
          return 'Ingrese monto a invertir';
      }
    },
    discountTypes() {
      return this.$store.state.discountTypes;
    },
    selectedSuscriptionType() {
      return this.$store.state.apv.subscriptionType;
    },
    selectedRegime() {
      return this.$store.state.apv.regime;
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
    maxInvestValue() {
      return this.bounders.max;
    },
    minInvestValue() {
      return this.bounders.min;
    },
    canInvest() {
      return !!this.amountType;
    },
  },
  watch: {
    isSingle() {
      this.$store.commit('SET_DATES', ['', '']);
      this.datesFilters = ['', ''];
    },
    amountType() {
      this.totalInvestAmount = 0;
      this.totalInvestAmountText = '';
    },
  },
  methods: {
    removeFormat() {
      if (this.totalInvestAmountText !== '') {
        switch (this.amountType) {
          case 'uf':
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
    applyMethod() {
      this.dates = this.datesFilters;
    },
    closedMethod() {
      this.datesFilters = this.dates;
    },
    verifyAmount() {
      let isValidInvest = false;
      let maxToInvest = Infinity;
      let minToInvest = 0;
      let isSuggestedInvest = true;
      switch (this.amountType) {
        case 'uf':
          maxToInvest = this.maxInvestValue.originValue;
          minToInvest = this.minInvestValue.originValue;
          isValidInvest = (this.totalAmountInvested >= minToInvest &&
                this.totalAmountInvested <= maxToInvest);

          if (this.suggested && this.totalAmountInvested > this.suggested.originValue) {
            isSuggestedInvest = false;
          }

          break;
        case 'clp':
          maxToInvest = this.maxInvestValue.value;
          minToInvest = this.minInvestValue.value;
          isValidInvest = (this.totalAmountInvested >= minToInvest &&
                this.totalAmountInvested <= maxToInvest);

          if (this.suggested && this.totalAmountInvested > this.suggested.value) {
            isSuggestedInvest = false;
          }

          break;
        default:
          isValidInvest = false;
          break;
      }

      if (!isSuggestedInvest) {
        sendPopupWithParams(
          'warning',
          transactionalMessages.apv.investAmountMaxSuggested,
          { montoMaximo: this.suggested.originValueString },
        );
      }
      if (isValidInvest) {
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
    },
  },
};
</script>
<style lang="scss">
.v-select {
  &.select-discount .dropdown-toggle {
    padding: 5px 10px;
  }
}

.v-money {
  border: none;
  border-bottom: 1px solid #ced4da;
}

.input-group-addon {
  padding: 0;
}
input#monthpicker-input-trigger {
  border-bottom: 1px solid #ced4da;
  color: black;
}

.input-group-addon {
  color: #ccc;
}
</style>
