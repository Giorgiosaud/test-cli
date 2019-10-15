<template>
  <div class="invest-wrapper">
    <div
      v-if="!selectedFund"
      id="mutual-funds-detail">
      <div class="empty-view">
        <div class="empty-view-txt">
          <h3>Fondos Mutuos</h3>
          <p>Selecciona un fondo para <b>continuar</b> con tu inversión</p>
        </div>
        <div class="container">
          <div class="row">
            <div class="col">
              <button
                type="button"
                class="btn content__button btn-primary btn-block py-4 m-0"
                disabled="disabled">Aporte</button>
            </div>
            <div class="col">
              <button
                type="button"
                class="btn content__button btn-primary btn-block py-4 m-0"
                disabled="disabled" >Rescate</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      id="mutual-funds-detail"
      class="active">
      <div class="mutual-funds-detail-header align-items-start">
        <div class="mutual-funds-detail-header-title">
          <h3 class="mb-0">
            <strong>{{ selectedFund.name }}</strong>
            <small
              v-if="selectedFund.serie"
              class="text-muted"> – Serie {{ selectedFund.serie }}</small>
          </h3>
          <a
            href="#"
            class="d-lg-none close-panel"
            @click.prevent="unsetSelectedFund"><i class="mdi mdi-close"/></a>
        </div>
        <div
          v-if="!showClientFunds"
          class="d-none d-md-flex mutual-funds-detail-header-risk">
          <div class="risk__space risk--label">
            Riesgo
          </div>
          <div class="risk__space risk--low">
            <div class="risk__label">Bajo</div>
            <div class="risk__state">
              <div
                :class="{'selected':selectedFund.risk===1}"
                class="risk">
                1
              </div>
              <div
                :class="{'selected':selectedFund.risk===2}"
                class="risk">
                2
              </div>
            </div>
          </div>
          <div class="risk__space risk--mid">
            <div class="risk__label">Medio</div>
            <div class="risk__state">
              <div
                :class="{'selected':selectedFund.risk===3}"
                class="risk">
                3
              </div>
              <div
                :class="{'selected':selectedFund.risk===4}"
                class="risk">
                4
              </div>
              <div
                :class="{'selected':selectedFund.risk===5}"
                class="risk">
                5
              </div>
            </div>
          </div>
          <div class="risk__space risk--mid">
            <div class="risk__label">Alto</div>
            <div class="risk__state">
              <div
                :class="{'selected':selectedFund.risk===6}"
                class="risk">
                6
              </div>
              <div
                :class="{'selected':selectedFund.risk===7}"
                class="risk">
                7
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="mutual-funds-client-actual-invested text-left text-md-right">
          <div class="amount text-muted">
            {{ selectedFund.availableAmount.originValue|currency }}
          </div>
          <div class="text-muted etiqueta">Monto disponible para rescate en todas sus cuentas</div>
        </div>
      </div>
      <div class="mutual-funds-detail-body">
        <div class="tabs-chart-mobile d-flex d-md-none mb-3">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a
                :class="{'active': tabChart}"
                href="#"
                class="nav-link"
                @click="tabChart = true">Gráfico</a>
            </li>
            <li class="nav-item">
              <a
                :class="{'active': !tabChart}"
                href="#"
                class="nav-link"
                @click="tabChart = false">Info</a>
            </li>
          </ul>
        </div>

        <div
          :class="{'d-none': !tabChart}"
          class="row align-items-center d-md-flex">
          <div class="col-md-12 d-lg-block" >
            <div class="graphic-detail">
              <graph/>
            </div>
          </div>
        </div>

        <div
          :class="{'d-none': tabChart}"
          class="mutual-funds-detail-footer d-md-flex">
          <div
            v-if="selectedFund.docUrl"
            class="mutual-funds-detail-footer-item-docs mx-2">
            <a
              :disabled="!selectedFund"
              :href="selectedFund.docUrl"
              class="see_docs"
              target="_blank">
              <i class="variation-icon mdi mdi-file-document"/>
              Ver documentos
            </a>
          </div>
          <div class="d-flex flex-column">
            <div class="container-mutual-funds-details">
              <div
                v-if="selectedFund.name"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item
                 mutual-funds-specs-item-nominal d-flex flex-column align-items-center
                 justify-content-center">
                <p class="text-muted mb-0">Rentabilidad Nominal</p>
                <p class="mb-0">{{ selectedFund.name }}</p>
              </div>
              <div
                v-if="selectedFund.day"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item
                d-flex flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0">Día</p>
                <p class="mb-0">{{ selectedFund.day }}</p>
              </div>
              <div
                v-if="selectedFund.month"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item
                d-flex flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0">Acum. mes</p>
                <p class="mb-0">{{ selectedFund.month }}</p>
              </div>
              <div
                v-if="selectedFund.lastMonth"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item
                d-flex flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0">Mes anterior</p>
                <p class="mb-0">{{ selectedFund.lastMonth }}</p>
              </div>
              <div
                v-if="selectedFund.trimester"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item
                d-flex flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0 text-center">Últ. trim</p>
                <p class="mb-0">{{ selectedFund.trimester }}</p>
              </div>
              <div
                v-if="selectedFund.year"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item
                d-flex flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0">Acum año</p>
                <p class="mb-0">{{ selectedFund.year }}</p>
              </div>
              <div
                v-if="selectedFund.lastYear"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item
                d-flex flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0">Año Anterior</p>
                <p class="mb-0">{{ selectedFund.lastYear }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mutual-funds-footer pb-0">
        <div class="container p-0">
          <div class="row">
            <div
              class="col">
              <button
                type="button"
                class="btn btn-link"
                @click="unsetSelectedFund">Cancelar</button>
            </div>
            <div
              class="col text-right">
              <button
                type="button"
                class="btn btn-primary"
                @click="deposit">Continuar</button>
            </div>
          </div>
          <div class="row">
            <p class="text-muted p-3 m-0">
              <small>
                *Infórmese de las características esenciales de la inversión en este fondo mutuo,
                las que se encuentran contenidas en su reglamento interno y contrato de suscripción de cuotas.
                La rentabilidad o ganancia obtenida en el pasado por este fondo,
                no garantiza que ella se repita en el futuro.
                Los valores de las cuotas de los fondos mutuos son variables.
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import graph from './graph';

export default {
  components: {
    graph,
  },
  data() {
    return {
      tabChart: true,
      user: window.liquid.user,
    };
  },
  computed: {
    titleOnNotInvest() {
      if (!this.canInvest) {
        return `Estimado Cliente, para operar con este fondo mutuo por favor
              contacte a su Gestor Patrimonial ${this.user.nombre_de_agente}`;
      }
      return false;
    },
    titleOnNotRescue() {
      if (!this.canRescue) {
        return `Estimado Cliente, para operar con este fondo mutuo por favor
              contacte a su Gestor Patrimonial ${this.user.nombre_de_agente}`;
      }
      return false;
    },
    selectedFund() {
      return this.$store.state.selectedFund;
    },
    isSingleMode() {
      return this.$store.state.mode === 'mutual-funds-simple';
    },
    showClientFunds() {
      return this.$store.state.showClientFunds;
    },
    mutualFundsInvested() {
      return this.$store.state.mutualFundsInvested;
    },
    mutualFundsToInvest() {
      return this.$store.state.mutualFundsToInvest;
    },
    canRescue() {
      const vm = this;
      return !!_.find(
        this.mutualFundsInvested,
        fund => fund.nemo === vm.selectedFund.nemo,
      );
    },
    canInvest() {
      const vm = this;
      return !!_.find(
        this.mutualFundsToInvest,
        fund => fund.nemo === vm.selectedFund.nemo,
      );
    },
  },
  updated() {
    this.$nextTick(() => {
      $('.tooltipper').tooltip();
    });
  },
  methods: {
    unsetSelectedFund() {
      this.$store.commit('SET_SELECTED_FUND', null);
    },
    deposit() {
      this.$store.commit('SET_MODAL_COMPONENT', 'single-invest');
      $('#modal').modal({ backdrop: 'static', keyboard: false });
    },
    withdraw() {
      this.$store.commit(
        'SET_MODAL_COMPONENT',
        'single-withdrawal',
      );
      $('#modal').modal({ backdrop: 'static', keyboard: false });
    },
  },
};
</script>
