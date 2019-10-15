<template>
  <div class="modal-content">
    <div
      v-if="!onWithdrawFlow"
      class="modal-header dotted-bottom justify-content-center">
      <h3
        v-if="isSuccess"
        class="p-3 modal-title">
        <i class="mdi mdi-check-circle response__icon"/>
        <b>Rescate Realizado</b>
      </h3>
      <h3
        v-else
        class="p-3 modal-title ">
        <i class="mdi mdi-close-circle response__icon response__icon--fail"/><b>Rescate Fallido</b>
      </h3>
    </div>
    <div
      v-if="onWithdrawFlow"
      class="modal-body">
      <div class="loader py-4">
        <div class="d-flex align-items-center justify-content-center h-100 flex-column">
          <div class="loading-ico"/>
          <div class="loading-description pt-3 text-muted">
            Realizando Rescate
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="modal-body p-0">
      <div class="header-description">
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Origen</div>
            <div class="header-description-value">{{ selectedInvestmentAccount.name }}</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">Destino</div>
            <div
              v-if="selectedDestinationAccount.type==='bank'"
              class="header-description-value">
              {{ selectedDestinationAccount.accountName }}
              <br>{{ selectedDestinationAccount.accountNumber }}
            </div>
            <div
              v-else
              class="header-description-value">{{ selectedDestinationAccount.accountName }}</div>
          </div>
        </div>
        <div class="header-description-row">
          <div class="header-description-element">
            <div class="header-description-label">Fecha</div>
            <div class="header-description-value">{{ date }}</div>
          </div>
          <div class="header-description-element">
            <div class="header-description-label">Tipo</div>
            <div class="header-description-value">Rescate</div>
          </div>
        </div>
        <div class="header-description-row">
          <div class="header-description-element px-0 justify-content-start">
            <div class="header-description-label">Monto Total</div>
            <div class="header-description-value ml-4">{{ withdrawalAmount|currency }}</div>
          </div>
        </div>
      </div>
      <div class="funds-description">
        <div class="funds-description-detail">
          <div class="funds-description-detail-headers">
            <div class="funds-description-detail-headers--title">Nombre FFMM</div>
            <div class="funds-description-detail-headers--title">Monto</div>
          </div>
          <div class="funds-description-detail-funds">
            <div
              v-for="(invest,index) in withdrawalListFullData"
              :key="index"
              class="funds-description-detail-elements">
              <div class="funds-description-detail-body--name">{{ invest.name }}</div>
              <div class="funds-description-detail-body--amount">{{ invest.amount|currency }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!onWithdrawFlow"
      class="modal-footer justify-content-center top-shadow p-3 p-md-4 reverse">
      <div class="col-12 col-md-6">
        <button
          type="button"
          class="btn btn-primary btn-block mr-auto"
          @click="cancel">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: moment().format('DD-MM-YYYY'),
      onWithdrawFlow: true,
      isSuccess: false,
    };
  },
  computed: {
    selectedInvestmentAccount() {
      return this.$store.state.selectedInvestmentAccount;
    },
    selectedDestinationAccount() {
      return this.$store.state.selectedDestinationAccount;
    },
    withdrawalAmount() {
      return this.$store.getters.withdrawalAmount;
    },
    withdrawalList() {
      return this.$store.getters.withdrawalList;
    },
    withdrawalListFullData() {
      return this.$store.getters.withdrawalListFullData;
    },
    withdrawalListToPost() {
      return this.$store.getters.withdrawalListToPost;
    },

  },
  created() {
    return this.postWithdraw();
  },
  methods: {
    postWithdraw() {
      const payload = {
        accountNumber: this.selectedInvestmentAccount.number,
        transactions: this.withdrawalListToPost,
      };
      const vm = this;
      this.$store.dispatch('MAKE_WITHDRAWAL', payload).then(() => {
        vm.onWithdrawFlow = false;
        vm.isSuccess = true;
      })

        .catch(() => {
          vm.onWithdrawFlow = false;
          vm.isSuccess = false;
        });
    },
    reloadFundsInvestedAndResetData() {
      const vm = this;
      this.$store.commit('SET_LOADING_FUNDS_INVESTED', true);
      this.$store.commit('SET_SELECTED_INVESTMENT_ACCOUNT', null);

      this.$store.dispatch('GET_INVESTED_DATA').then(() => {
        vm.$store.commit('SET_LOADING_FUNDS_INVESTED', false);
      });
    },
    cancel() {
      window.location.reload();
    },
  },
};
</script>
<style lang="scss" scoped>
//colors
$seashell: #f1f1f1;
$color_mountain_mist_approx: #999;
$color_burgundy_approx: #9b0822;
$color_suva_gray_approx: #888;
$color_aqua_forest_approx: #579e78;

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
.header-description-label {
  font-weight: bold;
}
.funds-description {
  width: 95%;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}
.funds-description-detail-header--title {
  font-weight: bold;
}
.funds-description-detail-header {
  padding: 0;
  display: flex;
  justify-content: space-between;
}
.funds-description-detail-headers {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.funds-description-detail-headers--title {
  padding: 0.5rem;
}
.funds-description-detail-funds {
  max-height: 120px;
  overflow: auto;
}
.funds-description-detail-elements {
  display: flex;
  width: 100%;
  justify-content: space-between;
  background: $seashell;
  &:not(:first-child) {
    margin-top: 5px;
  }
}
.funds-description-detail-body--name {
  padding: 0.5rem;
}
.funds-description-detail-body--amount {
  padding: 0.5rem;
}
.terms {
  width: 95%;
  margin: auto;
  padding: 10px 0;
  color: $color_mountain_mist_approx;
  p:last-child {
    margin: 0;
  }
}
.transaction-details {
  background: $seashell;
}
.response__icon {
  font-size: 4rem;
  color: $color_aqua_forest_approx;
  vertical-align: middle;
  &.response__icon--fail {
    font-size: 4rem;
    color: $color_burgundy_approx;
    vertical-align: middle;
  }
}
.response__title {
  font-weight: bold;
  color: $color_suva_gray_approx;
  display: flex;
  flex-direction: column;
  p {
    font-size: 0.9rem;
    font-weight: normal;
  }
}
@media screen and(max-width: 768px) {
  .header-description-element {
    flex-direction: column;
    padding: 10px;
    align-items: center;
    justify-content: center;
  }
}
@media screen and(max-width: 530px) {
  .modal-title {
    line-height: 1;
    font-size: 18px;
    .response__icon {
      font-size: 3rem;
    }
  }
  .modal-body {
    padding: 2rem 0.5rem;
  }
  .header-description-element {
    flex-direction: column;
    justify-content: center !important;
  }
  .header-description-value.ml-4 {
    margin-left: 0 !important;
  }
}
</style>
