<template>
  <div class="modal-content">
    <div class="modal-header bottom-shadow text-center p-3 p-md-4">
      <h3 class="modal-title text-left">
        <div class="col-12">
          <h2 class="text-muted">{{ topTitle }}</h2>
        </div>
        <div class="col-12">
          <h4 v-html="topSubtitle"/>
        </div>
      </h3>
    </div>
    <div class="modal-body">
      <div class="header-description">
        <div class="header-description-row">
          <div
            v-if="!isApvSigned"
            class="header-description-element">
            <div class="d-flex align-items-center w-100">
              <div class="icon">
                <svg
                  width="34"
                  height="48"
                  viewBox="0 0 34 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 3C0 1.34315 1.34315 0 3 0H25.4231C26.2799 0 27.0958 0.366368 27.6651 1.00672L33.2421
                7.27969C33.7303 7.82887 34 8.53815 34 9.27298V45C34 46.6569 32.6569 48 31 48H3C1.34315 48 0 46.6569
                0 45V3Z"
                    fill="#C4C4C4"/>
                  <rect
                    x="3.90625"
                    y="18.248"
                    width="25.7931"
                    height="3.57025"
                    fill="#E5E5E5"/>
                  <rect
                    x="3.90625"
                    y="10.7109"
                    width="25.7931"
                    height="3.57025"
                    fill="#E5E5E5"/>
                  <rect
                    x="3.90625"
                    y="24.9922"
                    width="25.7931"
                    height="3.57025"
                    fill="#E5E5E5"/>
                  <rect
                    x="3.90625"
                    y="32.5293"
                    width="12.1149"
                    height="3.57025"
                    fill="#E5E5E5"/>
                </svg>
              </div>
              <div class="document-title ml-3">
                Contrato de Adminsitración de Cartera de Ahorro Previsional Voluntario (APV)
              </div>
              <div class="link mx-3">
                <button
                  :disabled="isInQueue(APVParams)"
                  class="btn-link border-0"
                  @click="showDocumentPDF(
                    '/apv/subscription_otl',
                    APVParams,
                    'apv-document.pdf')">Ver</button>
              </div>
            </div>
          </div>
          <div class="header-description-element">
            <div class="d-flex align-items-center w-100">
              <div class="icon">
                <svg
                  width="34"
                  height="48"
                  viewBox="0 0 34 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 3C0 1.34315 1.34315 0 3 0H25.4231C26.2799 0 27.0958 0.366368 27.6651 1.00672L33.2421
                7.27969C33.7303 7.82887 34 8.53815 34 9.27298V45C34 46.6569 32.6569 48 31 48H3C1.34315 48 0 46.6569
                0 45V3Z"
                    fill="#C4C4C4"/>
                  <rect
                    x="3.90625"
                    y="18.248"
                    width="25.7931"
                    height="3.57025"
                    fill="#E5E5E5"/>
                  <rect
                    x="3.90625"
                    y="10.7109"
                    width="25.7931"
                    height="3.57025"
                    fill="#E5E5E5"/>
                  <rect
                    x="3.90625"
                    y="24.9922"
                    width="25.7931"
                    height="3.57025"
                    fill="#E5E5E5"/>
                  <rect
                    x="3.90625"
                    y="32.5293"
                    width="12.1149"
                    height="3.57025"
                    fill="#E5E5E5"/>
                </svg>
              </div>
              <div class="document-title ml-3">
                Formulario de Selección de Alternativas de Ahorro Previsional Voluntario
              </div>
              <div class="link mx-3">
                <button
                  :disabled="isInQueue(SAAPParams)"
                  class="btn-link border-0"
                  @click="showDocumentPDF(
                    '/apv/subscription_otl',
                    SAAPParams,
                    'saapv-document.pdf')">Ver</button>
              </div>
            </div>
          </div>
        </div>
        <div class="aceptaciones container">
          <div class="row">
            <div class="form-check py-3">
              <input
                id="leido"
                v-model="readedAccepted"
                class="form-check-input"
                type="checkbox"
                value="">
              <label
                class="form-check-label"
                for="leido"
                v-text="declaracion"/>
            </div>
          </div>
          <div class="row">
            <div class="form-check py-3">
              <input
                id="bounders"
                v-model="boundersAccepted"
                class="form-check-input"
                type="checkbox"
                value="">
              <label
                v-if="contractType==='DC'"
                class="form-check-label"
                for="bounders">
                Acepto que el límite del beneficio tributario es de 900 UF.
              </label>
              <label
                v-else
                class="form-check-label"
                for="bounders">
                Acepto que el límite del beneficio tributario es de 600 UF.
              </label>
            </div>
          </div>

        </div>
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
          :disabled="!boundersAccepted||!readedAccepted"
          type="button"
          class="btn btn-primary btn-block"
          @click="nextStep">
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { otl } from '../../../shared/mixins';

export default {
  name: 'PrefilledContract',
  mixins: [otl],
  data() {
    return {
      boundersAccepted: false,
      readedAccepted: false,
      date: moment()
        .format('DD-MM-YYYY'),
      selectedSuscriptionName: {
        systematic: 'Descuento Sistemático',
      },
      systematicDiscountTypeName: {
        unlimited: 'Indefinido',
        temporal: 'Temporal',
      },
    };
  },
  computed: {
    declaracion() {
      if (this.isApvSigned) {
        return 'Declaro haber leído el formulario de Selección de Alternativas de Ahorro Previsional Voluntario.';
      }
      return 'Declaro haber leído el contrato de administración de cartera de ahorro previsional voluntario, conocer y aceptar su contenido en todas sus partes y aceptar el formulario de Selección de Alternativas de Ahorro Previsional Voluntario.';
    },
    APVParams() {
      const apvParams = { ...this.$store.getters.apvContractInfo };
      apvParams.type = 'APV';
      apvParams.apv = _.pickBy(apvParams.apv, el => el !== '' && el !== null);
      apvParams.employer = _.pickBy(apvParams.employer, el => el !== '' && el !== null);
      return apvParams;
    },
    SAAPParams() {
      const SAAPParams = { ...this.$store.getters.apvContractInfo };
      SAAPParams.type = 'SAAP';
      SAAPParams.apv = _.pickBy(SAAPParams.apv, el => el !== '' && el !== null);
      SAAPParams.employer = _.pickBy(SAAPParams.employer, el => el !== '' && el !== null);
      return SAAPParams;
    },
    discountType() {
      return this.$store.state.discountType;
    },
    tipoText() {
      if (this.contractType === 'DD') {
        return 'Desde Cuenta del Banco';
      }
      let text = '';
      switch (this.discountType) {
        case 'unlimited':
          text = '– Indefinido';
          break;
        case 'temporal':
          text = '– Temporal';
          break;
        default:
          text = '';
          break;
      }
      return text;
    },
    regimenText() {
      if (this.contractType === 'DS') {
        return `– Régimen ${this.$store.state.apv.regime.toUpperCase()}`;
      } else if (this.contractType === 'DD') { return `Régimen ${this.$store.state.apv.regime.toUpperCase()}`; }
      return '';
    },
    contractType() {
      return this.$store.state.apv.subscriptionType;
    },
    selectedDiscountType() {
      return this.$store.state.selectedDiscountType;
    },
    startDate() {
      return moment(this.$store.state.dates[0]).format('MM-YYYY');
    },
    endDate() {
      return moment(this.$store.state.dates[1]).format('MM-YYYY');
    },
    regime() {
      return this.$store.state.regime;
    },
    simpleMode() {
      return this.$store.state.simpleMode;
    },
    selectedFromAccount() {
      return this.$store.state.selectedFromAccount;
    },
    investmentListFullData() {
      return this.$store.getters.investmentListFullData;
    },
    investedAmount() {
      return this.$store.getters.investedAmount;
    },
    selectedSubscriptionType() {
      return this.$store.state.selectedSuscription.type;
    },
    systematicDiscountType() {
      return this.$store.state.discountType;
    },
    isApvSigned() {
      return this.$store.state.isApvSigned;
    },
    topTitle() {
      if (this.contractType === 'DD') {
        return this.selectedSuscription;
      }
      return 'Ahorro APV';
    },
    topSubtitle() {
      if (this.contractType === 'DD') {
        return `<strong>Desde Cuenta del Banco</strong> – ${this.regimenText}`;
      }
      return `<strong>${this.selectedSuscription}</strong>${this.tipoText}${this.regimenText}`;
    },
    selectedSuscription() {
      return this.$store.state.selectedSuscriptionTitles[this.$store.state.apv.subscriptionType];
    },
  },
  methods: {
    investValue(invest) {
      switch (this.selectedDiscountType) {
        case 'uf':
          return this.$options.filters.currency(invest.uf, 'UF');
        case 'clp':
          return this.$options.filters.currency(invest.clp);
        case 'income_percentage':
          return this.$options.filters.percentage(invest.percentage);
        default:
          return invest.amount;
      }
    },
    nextStep() {
      if (this.contractType === 'DD') { return this.$store.commit('SET_MODAL_COMPONENT', 'invest-from-bank'); }
      return this.$store.commit('SET_MODAL_COMPONENT', 'invest-voucher');
    },
    cancel() {
      $('#modal')
        .modal('hide');
    },
  },
};
</script>
<style lang="scss" scoped>
//colors
$seashell: #f1f1f1;
$color_mountain_mist_approx: #999;
.document-title {
  font-weight: bold;
  width: 100%;
}
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
  border-bottom: 1px solid $seashell;
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

.btn-link {
  cursor: pointer;
}

@media (max-width: 530px) {
  .header-description-element {
    border-bottom: 1px solid #f1f1f1;
    flex-direction: row;
    justify-content: space-between;
    flex: auto;
  }
  .header-description-row {
    flex-direction: column;
  }
  .header-description-element:nth-child(2) {
    padding-left: 0;
    border-right: none;
    border-left: none;
  }
}
</style>
