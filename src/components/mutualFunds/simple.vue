<template>
  <div>
    <div
      id="head"
      class="d-md-none row no-gutters bottom-shadow py-2 py-md-4">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2><strong> {{ selectedSuscription }} -</strong></h2>
          </div>
          <div class="col-12">
            <h4>{{ tipoText }} {{ regimenText }}</h4>
          </div>
        </div>
      </div>
    </div>
    <div
      id="body"
      class="">
      <div class="row no-gutters">

        <div class="col-12">
          <mutual-funds-list/>
        </div>
        <div class="col-12">
          <mutual-funds-details selected-fund="selectedFund"/>
        </div>
      </div>
    </div>
    <div
      id="footer"
      class="top-shadow py-4 d-md-none">
      <div class="container">
        <div class="d-flex align-items-center justify-content-between">
          <button
            class="btn btn-link"
            @click.prevent="cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import List from './list';
import Detail from './detail';

export default {
  components: {
    'mutual-funds-list': List,
    'mutual-funds-details': Detail,
  },
  computed: {
    selectedFund() {
      return this.$store.state.mutualFundsToInvest.find(fund => fund.nemo === this.$store.state.selectedFund);
    },
    contractType() {
      return this.$store.state.apv.subscriptionType;
    },
    selectedSuscription() {
      return this.$store.state.selectedSuscriptionTitles[this.$store.state.apv.subscriptionType];
    },
    regimenText() {
      if (this.contractType === 'DS') {
        return `– Régimen ${this.$store.state.apv.regime.toUpperCase()}`;
      } else if (this.contractType === 'DD') { return `Régimen ${this.$store.state.apv.regime.toUpperCase()}`; }
      return '';
    },
    discountType() {
      return this.$store.state.discountType;
    },

    tipoText() {
      let text = '';
      switch (this.discountType) {
        case 'unlimited':
          text = 'Indefinido';
          break;
        case 'temporal':
          text = 'Temporal';
          break;
        default:
          text = '';
          break;
      }
      return text;
    },
  },
  methods: {
    cancel() {
      if (this.contractType === 'DD') {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'mini-form');
      } else {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'full-form');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  #footer{
    z-index: 10;
  }
</style>
