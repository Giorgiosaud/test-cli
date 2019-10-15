<template>
  <div
    v-if="selectedFund"
    class="modal-content">
    <div class="modal-header bg-white text-dark bottom-shadow p-3 p-md-4">
      <div class="d-block w-100">
        <div class="d-flex justify-content-between align-items-center title-steps">
          <h3 class="modal-title">Ficha Fondo Mutuo</h3>
          <div
            v-if="isAporte"
            class="risk-table">
            <div class="d-none d-md-flex mutual-funds-detail-header-risk">
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
              <div class="risk__space risk--high">
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
          </div>
        </div>
        <div class="d-flex">
          <h5 class="modal-subtitle">
            <strong>{{ selectedFund.name }}</strong>
            <span>– <small class="text-muted">Serie {{ selectedFund.serie }}</small>
            </span>
          </h5>
        </div>
      </div>
    </div>
    <div class="modal-body d-flex px-0 py-0">

      <div class="mutual-funds-detail-body container">
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
          <div class="mutual-funds-detail-footer-item-docs mr-4">
            <a
              :disabled="!selectedFund"
              :href="selectedFund.docUrl"
              class="see_docs"
              target="_blank">
              <i class="variation-icon mdi mdi-file-document"/>
              Ver documentos
            </a>
          </div>
          <div class="d-flex flex-column flex-expand">
            <div class="container-mutual-funds-details">
              <div
                v-if="selectedFund.name"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item mutual-funds-specs-item-nominal">
                <p class="text-muted mb-0">Rentabilidad Nominal</p>
                <p class="mb-0">{{ selectedFund.name }}</p>
              </div>
              <div
                v-if="selectedFund.day"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item d-flex
                flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0">Día</p>
                <p class="mb-0">{{ selectedFund.day|percentage }}</p>
              </div>
              <div
                v-if="selectedFund.month"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item d-flex
                 flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0">Acum. mes</p>
                <p class="mb-0">{{ selectedFund.month | percentage }}</p>
              </div>
              <div
                v-if="selectedFund.lastMonth"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item d-flex
                 flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0">Mes anterior</p>
                <p class="mb-0">{{ selectedFund.lastMonth|percentage }}</p>
              </div>
              <div
                v-if="selectedFund.trimester"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item
                d-flex flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0 text-center">Últ. trim</p>
                <p class="mb-0">{{ selectedFund.trimester|percentage }}</p>
              </div>
              <div
                v-if="selectedFund.year"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item
                d-flex flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0">Acum año</p>
                <p class="mb-0">{{ selectedFund.year|percentage }}</p>
              </div>
              <div
                v-if="selectedFund.lastYear"
                class="mutual-funds-detail-footer-item mutual-funds-specs-item
                 d-flex flex-column align-items-center justify-content-center">
                <p class="text-muted mb-0">Año Anterior</p>
                <p class="mb-0">{{ selectedFund.lastYear|percentage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer bg-white justify-content-between top-shadow p-3 p-md-4">
      <button
        type="button"
        class="btn btn-link w-100 text-left"
        data-dismiss="modal">Cancelar
      </button>
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
    };
  },
  computed: {
    isAporte() {
      return this.$store.state.aporteMode;
    },
    selectedFund() {
      return this.$store.state.selectedFund;
    },
  },
};
</script>
