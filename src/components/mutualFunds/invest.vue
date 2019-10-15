<template>
  <div class="row no-gutters">
    <div
      class="p-3 col-4 d-flex align-items-center bg-gris border-top-light">
      <p class="mb-0 name-table">{{ fund.name }}</p>
    </div>
    <div class="col-1 d-flex align-items-center justify-content-center bg-gris border-top-light">
      <a
        href="#modal"
        tabindex="-1"
        class="btn btn-outline-primary btn-sm d-none d-md-inline-block"
        data-toggle="modal"
        @click.prevent="selectFund(fund)" >Ver</a>
    </div>
    <div class="col-1 d-flex align-items-center justify-content-center bg-gris border-top-light">
      <p class="text-md-center mb-0">
        <span
          :class="riskLevel"
          class="fund-risk mx-auto text-center">{{ fund.risk }}</span>
      </p>
    </div>
    <div class="col-2 d-flex align-items-center justify-content-center bg-gris percentageChange30d border-top-light">
      <p class="text-md-center mb-0">
        <span :class="{'green': parseFloat(fund.profitLast30.replace(',','.')) > 0}">{{ fund.profitLast30 }}</span>
      </p>
    </div>
    <div class="col-2  d-flex align-items-center justify-content-center input-full border-rtl-light">
      <input
        v-model="percentageText"
        :disabled="disableInvestFields"
        type="text"
        class="form-control text-right"
        placeholder="0 %"
        @focus="enterPercentageText"
        @blur="leavePercentageText">
    </div>
    <div
      class="col-2 d-flex align-items-center justify-content-center input-full border-rtl-light">
      <input
        v-model="amountText"
        :disabled="disableInvestFields"
        :placeholder="amountPlaceholder"
        type="text"
        class="form-control text-right"
        @focus="enterAmountText"
        @blur="leaveAmountText"

      >
    </div>
  </div>
</template>

<script>
import { moneyFormat, ufFormat, percentageFormat } from '../../../shared/variables';

export default {
  props: {
    fund: { type: Object, required: true },
  },
  data() {
    return {
      money: moneyFormat,
      percentageFormat,
      percentageText: '',
      percentage: 0,
      amount: 0,
      amountText: '',
    };
  },
  computed: {
    amountPlaceholder() {
      switch (this.amountType) {
        case 'uf':
          return '0 UF';
        case 'clp':
        default:
          return '$ 0';
      }
    },
    riskLevel() {
      if (this.fund.risk < 3) return 'risk-low';
      else if (this.fund.risk < 6) return 'risk-mid';
      return 'risk-high';
    },
    format() {
      switch (this.amountType) {
        case 'uf':
          return ufFormat;
        case 'clp':
          return moneyFormat;
        default:
          return moneyFormat;
      }
    },
    amountType() {
      return this.$store.state.apv.amountType;
    },
    bounders() {
      return this.$store.state.bounders;
    },
    toInvestAmount() {
      return this.$store.getters.toInvestAmount;
    },
    totalInvestAmount() {
      return this.$store.state.apv.amount;
    },
    investmentList() {
      return this.$store.getters.investmentList;
    },
    investmentListFullData() {
      return this.$store.getters.investmentListFullData;
    },
    canInvest() {
      return this.toInvestAmount > 0;
    },
    totalInvested() {
      return this.investmentListFullData.reduce((acum, invest) => {
        if (this.fund.nemo === invest.nemo) {
          return acum;
        }
        return acum + invest.amount;
      }, 0);
    },
    totalPercentageInvested() {
      return this.investmentListFullData.reduce((acum, invest) => {
        if (this.fund.nemo === invest.nemo) {
          return acum;
        }
        return acum + parseFloat(invest.percentage);
      }, 0);
    },
    invest() {
      return {
        nemo: this.fund.nemo,
        amount: this.fund.amount,
      };
    },
    disableInvestFields() {
      return (this.totalPercentageInvested === 100 || !this.totalInvestAmount);
    },
  },
  watch: {
    totalInvestAmount() {
      this.resetInvestValues();
    },
  },
  methods: {
    resetInvestValues() {
      this.$store.commit('SET_OPERATION_CODE', null);
      this.$store.commit('SET_SELECTED_BANK', null);
      this.percentage = 0;
      this.percentageText = '';
      this.amount = 0;
      this.amountText = '';
      this.$set(this.fund, 'clp', 0);
      this.$set(this.fund, 'uf', 0);
      this.$set(this.fund, 'percentage', 0);
      this.$set(this.fund, 'amount', 0);
    },
    unformatPercentage() {
      const text = this.percentageText.replace(',', '.');
      this.percentageText = parseFloat(text)
        .toFixed(2)
        .toString()
        .replace('.', ',');
    },
    validateAndFormatPercentage() {
      this.percentage = parseFloat(this.percentageText.replace(',', '.'));
      if (
        Number.isNaN(this.percentage) ||
        this.percentage > 100 ||
        (this.totalPercentageInvested + this.percentage > 100)
      ) {
        this.resetInvestValues();
      } else {
        this.percentageText = `${this.percentage.toFixed(2).toString().replace('.', ',')} %`;
        this.calculateFundAmount();
      }
      this.fund.percentage = this.percentage;
    },
    calculateFundAmount() {
      if (this.amountType === 'uf') {
        this.amount = (this.percentage / 100) * this.totalInvestAmount;
        const amountText = this.amount.toFixed(2).toString();
        this.amountText = `${amountText.replace('.', ',')} UF`;
      } else if (this.amountType === 'clp') {
        this.amount = Math.round((this.percentage / 100) * this.totalInvestAmount);
        const amountText = this.amount.toString();
        this.amountText = `$ ${amountText.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
      }
      this.$set(this.fund, 'clp', 0);
      this.$set(this.fund, 'uf', 0);
      this.$set(this.fund, 'amount', this.amount);
      this.$set(this.fund, this.amountType, this.amount);
    },
    unformatAmount() {
      if (this.amountType === 'clp') {
        if (this.amountText.split('$')[1]) {
          this.amountText = parseInt(this.amountText.split('$')[1].replace(/\./g, '').trim(), 10);
        } else {
          this.amountText = '';
        }
      } else if (this.amountType === 'uf') {
        const text = this.amountText.replace(/\./g, '').replace(',', '.');
        this.amountText = parseFloat(text)
          .toFixed(2)
          .toString()
          .replace('.', ',');
      }
    },
    validateCLP() {
      this.amount = parseInt(this.amountText, 10);
      if (Number.isNaN(this.amount)) {
        this.resetInvestValues();
        return;
      }
      const comparePercentage = Math.round((this.amount / this.totalInvestAmount) * 10000) / 100;
      if (this.percentage !== comparePercentage) {
        this.amount = (comparePercentage / 100) * this.totalInvestAmount;
        this.percentage = comparePercentage;
        this.percentageText = `${this.percentage.toFixed(2).toString().replace('.', ',')} %`;
      }
      this.amountText = `$ ${parseInt(this.amount, 10)
        .toString()
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    },
    validateUF() {
      this.amount = parseFloat(this.amountText.replace(/\./g, '').replace(',', '.'));
      const comparePercentage = Math.round((this.amount / this.totalInvestAmount) * 10000) / 100;
      if (Math.abs(this.percentage - comparePercentage) > 0.1) {
        if (Number.isNaN(this.amount) || this.totalPercentageInvested + comparePercentage > 100) {
          this.resetInvestValues();
          return;
        }
        this.amount = (comparePercentage / 100) * this.totalInvestAmount;
        this.percentage = comparePercentage;
        this.percentageText = `${this.percentage.toFixed(2).toString().replace('.', ',')} %`;
      }
      const text = Math.round(this.amount * 10000) / 10000;
      this.amountText = `${text.toFixed(2).toString().replace('.', ',')} UF`;
    },
    validateAndFormatAmount() {
      if (this.amountType === 'clp') {
        this.validateCLP();
      } else if (this.amountType === 'uf') {
        this.validateUF();
      }
      this.$set(this.fund, 'clp', 0);
      this.$set(this.fund, 'uf', 0);
      this.$set(this.fund, 'percentage', this.percentage);
      this.$set(this.fund, 'amount', this.amount);
      this.$set(this.fund, this.amountType, this.amount);
    },
    enterPercentageText() {
      if (this.percentageText !== '' && this.percentageText !== '0') { this.unformatPercentage(); }
    },
    leavePercentageText() {
      if (this.percentageText === '' || this.percentageText === '0') {
        this.resetInvestValues();
      } else {
        this.validateAndFormatPercentage();
      }
    },
    enterAmountText() {
      if (this.amountText !== '' && this.amountText !== '0') { this.unformatAmount(); }
    },
    leaveAmountText() {
      if (this.amountText === '' || this.amountText === '0' || this.amountText > this.totalInvestAmount) {
        this.resetInvestValues();
      } else {
        this.validateAndFormatAmount();
      }
    },
    validateAmmount() {
      this.$set(this.fund, 'percentage', this.percentage);
    },
    checkAmount() {
      this.validateAmmount();
    },
    openModal(fund) {
      this.$store.commit('SET_SELECTED_FUND', fund);
      this.$store.commit(
        'SET_MODAL_COMPONENT',
        'mutual-funds-multiple-detail-fund',
      );
      $('#modal').modal({ backdrop: true });
    },
    selectFund(fund) {
      this.$store.commit('SET_SELECTED_FUND', fund);
      this.$store.commit('SET_MODAL_COMPONENT', 'multiple-detail-fund');
    },
  },
};
</script>
<style>
.input-full .form-control {
  max-height: 55px;
}
.no-money:focus {
  color: #000;
}

.no-money {
  color: #999;
}
</style>
