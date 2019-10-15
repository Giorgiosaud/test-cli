<template>
  <div class="d-flex flex-column">
    <div
      id="head"
      class="row no-gutters bottom-shadow py-2 py-md-4">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2><strong>{{ selectedContractTypeDetails.title }}</strong></h2>
          </div>
          <div class="col-12">
            <h4>{{ regimenText }}</h4>
          </div>
        </div>
      </div>
    </div>
    <div
      id="body"
      class="py-md-4">
      <div class="container">
        <div class="row py-3 pt-md-0 pb-3">
          <div class="col-12">
            <strong>Datos Personales</strong>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div
              :class="{ 'error': errors.has('AFP') }"
              class="row">
              <label
                for="afp"
                class="col-12 col-md-3 col-form-label">AFP Actual</label>
              <div class="col-12 col-md-9 form-group">
                <v-select
                  v-validate="'required'"
                  id="afp"
                  v-model="prevision"
                  :options="Afps"
                  placeholder="Seleccionar"
                  name="AFP"
                  index="id"
                  label="name"
                />
                <span
                  v-show="errors.has('AFP')"
                  class="help is-danger"
                  v-text="errors.first('AFP')"/>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div
              :class="{ 'error': errors.has('Tipo de trabajador') }"
              class="row">
              <label
                for="WorkerType"
                class="col-12 col-md-3 col-form-label">Tipo de Trabajador</label>
              <div class="col-12 col-md-9 form-group">
                <v-select
                  v-validate="'required'"
                  id="WorkerType"
                  v-model="workerType"
                  :options="TypesOfWorkers"
                  placeholder="Seleccionar"
                  name="Tipo de trabajador"
                  index="id"
                  label="name"
                />
                <span
                  v-show="errors.has('Tipo de trabajador')"
                  class="help is-danger"
                  v-text="errors.first('Tipo de trabajador')"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      id="footer"
      class="top-shadow py-4">
      <div class="container">
        <div class="d-flex align-items-center justify-content-between">
          <button
            class="btn btn-link"
            @click.prevent="cancelar">
            Volver
          </button>
          <button
            :disabled="errors.any()"
            class="btn btn-primary"
            @click.prevent="Continuar">
            Continuar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    TypesOfWorkers() {
      return this.$store.state.TypesOfWorkers;
    },
    workerType: {
      get() {
        return this.$store.state.apv.workerType;
      },
      set(value) {
        this.$store.commit('SET_WORKER_TYPE', value);
      },
    },
    contractType() {
      return this.$store.state.apv.subscriptionType;
    },
    selectedContractTypeDetails() {
      return this.$store.state.suscriptions.find(sus => sus.type === this.contractType);
    },
    prevision: {
      get() {
        return this.$store.state.apv.prevision;
      },
      set(value) {
        this.$store.commit('SET_PREVISION', value);
      },
    },
    Afps() {
      return this.$store.state.Afps;
    },
    regimenText() {
      return `Régimen ${this.$store.state.apv.regime.toUpperCase()}`;
    },
  },
  created() {
    this.$store.dispatch('IS_APV_SIGNED');
  },
  methods: {
    Continuar() {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            return this.$store.commit('SET_CURTAIN_ELEMENT', 'mutual-funds');
          }
          return false;
        });
    },
    cancelar() {
      this.$store.commit('SET_CURTAIN_ELEMENT', 'regime-selector');
      this.$store.commit('SET_REGIME', null);
    },
  },
};
</script>
<style lang="scss" scoped>
.with-search-icon {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 28px;
  top: 8px;
}

.with-search-icon input {
  padding-left: 40px;
}

.search-box-container {
  display: block;
  position: relative;
  width: 100%;

  .search-box {
    position: absolute;
    z-index: 1000;
    width: 100%;
    background: white;

    ul.search-list {
      list-style: none;
      max-height: 100px;
      overflow: auto;
      border: 1px solid #ced4da;
      box-shadow: 5px 5px 5px #ced4da;
    }

    li.list-item {
      cursor: pointer;
      padding: 5px 10px;
    }

    li.list-item:hover {
      background: #074b73;
      color: white;
    }
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

  &.positioned {
    position: absolute;
    right: 30px;
    top: 10px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .col-form-label {
    margin: 0;
    line-height: 1;
  }
  #body {
    padding-bottom: 100px;
  }
}
</style>
