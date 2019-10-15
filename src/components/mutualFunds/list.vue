<template>
  <aside id="sidebar-invest">
    <div class="list-invest">
      <div
        v-if="loadingFundsToInvest &&!showClientFunds"
        class="d-flex align-items-center justify-content-center h-100">
        <div class="loading-ico"/>
      </div>
      <div
        v-if="loadingFundsInvested && showClientFunds"
        class="d-flex align-items-center justify-content-center h-100">
        <div class="loading-ico"/>
      </div>
      <div
        v-for="(fund,index) in mutualFundsList"
        v-else
        :key="index"
        :class="{active: fund === selectedFund}"
        class="invest-item"
        @click.prevent="selectFund(fund)">
        <div class="d-flex w-100 align-items-center justify-content-between">
          <p class="mb-0" >{{ fund.name }}</p>
          <span
            v-if="fund.risk"
            :class="{ 'bg-red' : fund.risk > 5, 'bg-yellow' : fund.risk > 2}"
            class="d-inline-block d-md-none risk-invest-item">{{ fund.risk }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>
<script>
export default {
  name: 'MutualFundsList',
  computed: {
    investedData() {
      return this.$store.state.investedData;
    },
    loadingFundsToInvest() {
      return this.$store.state.loadingFundsToInvest;
    },
    loadingFundsInvested() {
      return this.$store.state.loadingFundsInvested;
    },
    apvs() {
      return this.$store.state.apvs;
    },
    mutualFundsList() {
      return this.$store.state.mutualFundsToInvest;
    },
    showClientFunds: {
      get() {
        return this.$store.state.showClientFunds;
      },
      set(fund) {
        this.$store.commit('SET_SELECTED_FUND', null);
        return this.$store.commit('SET_SHOW_CLIENTS_FUNDS', fund);
      },
    },
    selectedFund: {
      get() {
        return this.$store.state.selectedFund;
      },
      set(fund) {
        if (fund === this.selectedFund) {
          return this.$store.commit('SET_SELECTED_FUND', null);
        }
        return this.$store.commit('SET_SELECTED_FUND', fund);
      },
    },
  },
  watch: {
    selectedFund() {
      this.$store.commit('SET_MODAL_COMPONENT', '');
    },
  },
  methods: {
    selectFund(fund) {
      this.$store.dispatch('CLEAN_INVESTMENTS');
      this.$store.commit('SET_SELECTED_FROM_ACCOUNT', null);
      this.$store.commit('SET_SELECTED_ACCOUNT_BALANCE', null);
      if (fund === this.selectedFund) {
        this.$store.commit('SET_SELECTED_FUND', null);
      } else {
        this.$store.commit('SET_SELECTED_FUND', fund);
      }
    },
    riskLevel(level) {
      if (level < 3) return 'risk-low';
      else if (level < 6) {
        return 'risk-mid';
      }
      return 'risk-high';
    },
  },
};
</script>
