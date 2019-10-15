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
            <h4>{{ tipoText }}{{ regimenText }}</h4>
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
                  placeholder="Seleccione Su AFP"
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
        </div>
        <div class="row">
          <div class=" py-3 pt-md-0 pb-3">
            <div class="col-12">
              <strong>Datos Empleador</strong>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="row form-group align-items-center">
              <label
                for=""
                class="col-form-label col-md-3">Buscador</label>
              <div class="col-md-9">
                <div class="row">

                  <div class="col with-search-icon">
                    <svg
                      width="21"
                      height="24"
                      class="search-icon"
                      viewBox="0 0 21 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.4843 9.05466C16.4843 13.2368 13.1202 16.6093 8.99216 16.6093C4.86413 16.6093
                    1.5 13.2368 1.5 9.05466C1.5 4.87253 4.86413 1.5 8.99216 1.5C13.1202 1.5 16.4843 4.87253
                    16.4843 9.05466Z"
                        stroke="#CCCCCC"
                        stroke-width="3"/>
                      <path
                        d="M12.7373 14.3379L19.6544 21.9995"
                        stroke="#CCCCCC"
                        stroke-width="3"/>
                    </svg>

                    <input
                      v-click-outside="cleanSearchData"
                      id="searcher"
                      v-model="searchField"
                      name="Buscar"
                      class="form-control"
                      type="text"
                      placeholder="Buscar por Razón Social"
                      autocomplete="off"
                      @keyup="search"
                    >

                    <div
                      v-if="searching"
                      class="loading-ico-xs positioned"/>

                    <div class="search-box-container">
                      <transition name="fade">

                        <div
                          v-if="searchedData.length"
                          class="search-box">
                          <ul class="search-list">
                            <li
                              v-for="(data,index) in searchedData"
                              :key="index"
                              class="list-item"
                              @click="selectData(data)">
                              {{ data.name }}
                            </li>
                            <li
                              class="list-item"
                              @click="activateInputs">Ingresar manualmente</li>
                          </ul>
                        </div>

                      </transition>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              :class="{ 'error': errors.has('Rut Empleador') }"
              class="form-group row">
              <label
                for="rut"
                class="col-12 col-md-3 col-form-label">RUT</label>
              <div class="col-12 col-md-9">

                <input
                  v-validate="'required|rut'"
                  v-rut="employerRut"
                  id="rut"
                  v-model="employerRut"
                  :disabled="lock.employerRut"
                  data-vv-scope="rut"
                  name="Rut Empleador"
                  class="form-control"
                  type="text"
                >
                <span
                  v-show="errors.has('Rut Empleador','rut')"
                  class="help is-danger"
                  v-text="errors.first('Rut Empleador','rut')"/>
              </div>
            </div>
            <div
              :class="{ 'error': errors.has('Razón Social') }"
              class="form-group row">
              <label
                for="companyName"
                class="col-12 col-md-3 col-form-label">Razón Social</label>
              <div class="col-12 col-md-9">

                <input
                  v-validate="'required'"
                  id="companyName"
                  v-model="employerCompanyName"
                  :disabled="lock.companyName"
                  name="Razón Social"
                  class="form-control"
                  type="text"
                  autocomplete="off"
                >

                <span
                  v-show="errors.has('Razón Social')"
                  class="help is-danger"
                  v-text="errors.first('Razón Social')"/>
              </div>
            </div>
            <div
              :class="{ 'error': errors.has('Ciudad') }"
              class="row">
              <label
                for="ciudad"
                class="col-12 col-md-3 col-form-label">Ciudad</label>
              <div class="col-12 col-md-9 form-group">
                <v-select
                  v-validate="'required'"
                  id="ciudad"
                  v-model="employer.city"
                  :options="cities"
                  :disabled="lock.city"
                  placeholder="Seleccione la ciudad"
                  name="Ciudad"
                />
                <span
                  v-show="errors.has('Ciudad')"
                  class="help is-danger"
                  v-text="errors.first('Ciudad')"/>
              </div>
            </div>
            <div
              :class="{ 'error': errors.has('Comuna') }"
              class="row">
              <label
                for="commune"
                class="col-12 col-md-3 col-form-label">Comuna</label>
              <div class="col-12 col-md-9 form-group">
                <v-select
                  v-validate="'required'"
                  id="commune"
                  v-model="employerCommune"
                  :options="communes"
                  :disabled="lock.commune"
                  placeholder="Seleccione la comuna"
                  name="Comuna"
                />
                <span
                  v-show="errors.has('Comuna')"
                  class="help is-danger"
                  v-text="errors.first('Comuna')"/>
              </div>
            </div>
            <div
              :class="{ 'error': errors.has('Domicilio') }"
              class="form-group row">
              <label
                for="Domicilio"
                class="col-12 col-md-3 col-form-label">Domicilio</label>
              <div class="col-12 col-md-9">
                <input
                  v-validate="'required'"
                  id="Domicilio"
                  v-model="employer.address"
                  :disabled="lock.address"
                  name="Domicilio"
                  class="form-control"
                >
                <span
                  v-show="errors.has('Domicilio')"
                  class="help is-danger"
                  v-text="errors.first('Domicilio')"/>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div
              :class="{ 'error': errors.has('Encargado de RRHH') }"
              class="form-group row">
              <label
                for="Encargado"
                class="col-12 col-md-3 col-form-label">Encargado de RRHH</label>
              <div class="col-12 col-md-9">
                <input
                  v-validate="'required'"
                  id="Encargado"
                  v-model="employer.rrhhManager"
                  :disabled="lock.rrhhManager"
                  name="Encargado de RRHH"
                  class="form-control"
                >
                <span
                  v-show="errors.has('Encargado de RRHH')"
                  class="help is-danger"
                  v-text="errors.first('Encargado de RRHH')"/>
              </div>
            </div>
            <div
              :class="{ 'error': errors.has('Teléfono') }"
              class="form-group row">
              <label
                for="phone"
                class="col-12 col-md-3 col-form-label">Teléfono</label>
              <div class="col-12 col-md-9">
                <input
                  v-validate="'required|numeric|min:9'"
                  id="phone"
                  v-model="employer.phone"
                  :disabled="lock.phone"
                  name="Teléfono"
                  class="form-control"
                >
                <span
                  v-show="errors.has('Teléfono')"
                  class="help is-danger"
                  v-text="errors.first('Teléfono')"/>
              </div>
            </div>
            <div
              :class="{ 'error': errors.has('Email') }"
              class="form-group row">
              <label
                for="email"
                class="col-12 col-md-3 col-form-label">Email</label>
              <div class="col-12 col-md-9">
                <input
                  v-validate="'required|email'"
                  id="email"
                  v-model="employer.email"
                  :disabled="lock.email"
                  name="Email"
                  class="form-control"
                >
                <span
                  v-show="errors.has('Email')"
                  class="help is-danger"
                  v-text="errors.first('Email')"/>
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
            :disabled="errors.any() || continueButtonisDisabled"
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
import { moneyFormat } from '../../shared/variables';

export default {
  data() {
    return {
      moneyFormat,
      searchField: '',
      searchedData: [],
      searching: false,
    };
  },
  computed: {
    lock() {
      return this.$store.state.lock;
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
    employer: {
      get() {
        return this.$store.state.employer;
      },
      set(employer) {
        this.$store.commit('SET_EMPLOYER_DATA', employer);
      },
    },
    employerCommune: {
      get() {
        return this.$store.state.employer.commune;
      },
      set(commune) {
        this.$store.commit('SET_EMPLOYER_DATA', { commune });
      },
    },
    employerCompanyName: {
      get() {
        return this.$store.state.employer.companyName;
      },
      set(companyName) {
        this.$store.commit('SET_EMPLOYER_DATA', { companyName });
      },
    },
    employerRut: {
      get() {
        return this.$store.state.employer.rut;
      },
      set(rutSetted) {
        this.$store.commit('SET_EMPLOYER_DATA', { rut: rutSetted });
      },
    },
    tipoText() {
      let text = '';
      switch (this.$store.state.discountType) {
        case 'unlimited':
          text = 'Indefinido';
          break;
        case 'temporal':
          text = 'Temporal';
          break;
        default:
          text = 'Undefined';
          break;
      }
      return text;
    },
    cities() {
      return this.$store.state.citiesAndCommunes.cities;
    },
    communes() {
      return this.$store.state.citiesAndCommunes.communes;
    },
    regimenText() {
      if (this.contractType === 'DS') { return `– Régimen ${this.$store.state.apv.regime.toUpperCase()}`; }
      return '';
    },
    continueButtonisDisabled() {
      return this.employerRut === '';
    },
  },
  created() {
    Promise.all([this.$store.dispatch('IS_APV_SIGNED'), this.$store.dispatch('GET_CITIES_AND_COMMUNES'), this.$store.dispatch('GET_REGIONS')])
      .then(() => {
        this.loading = false;
      });
  },
  methods: {
    cleanSearchData() {
      this.searchedData = [];
    },
    Continuar() {
      this.$validator.validateScopes()
        .then((result) => {
          if (result) {
            return this.$store.commit('SET_CURTAIN_ELEMENT', 'mutual-funds');
          }
          return false;
        });
    },
    cancelar() {
      if (this.contractType === 'DC') {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'home');
        this.$store.commit('SET_CURTAIN_ELEMENT', null);
      } else {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'regime-selector');
      }
      this.$store.commit('SET_REGIME', null);
    },

    search: _.debounce(function search() {
      if (this.searchField.length >= 3) {
        this.searching = true;
        this.$store.dispatch('CLEAR_EMPLOYER_DATA').then(() => {
          this.$store.dispatch('GET_EMPLOYER_DATA', { searchBy: 'name', searchField: this.searchField })
            .then((data) => {
              this.searchedData = data;
            })
            .catch(() => {
              this.searchedData = [];
            })
            .finally(() => {
              this.searching = false;
            });
        });
      }
    }, 500),
    setEmployerData(data) {
      this.employerRut = data.employerRut;
      if (data.name !== '') {
        this.employer.companyName = data.name;
        this.lock.companyName = true;
      } else {
        this.lock.companyName = false;
      }
      this.activateInputs();
    },
    selectData(data) {
      this.setEmployerData(data);
      this.searchedData = [];
      this.lock.employerRut = true;
      this.lock.companyName = true;
    },

    activateInputs() {
      this.$store.dispatch('UNLOCK_ALL_FORM_FIELDS').then(() => {
        this.searchedData = [];
        this.searchField = '';
      });
    },
    lockInputs() {
      this.$store.dispatch('LOCK_ALL_FORM_FIELDS').then(() => {
        this.searchedData = [];
      });
    },
  },
};
</script>
<style lang="scss">
.v-select {
  .dropdown-menu {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    overflow-y: scroll !important;
    transform: translate3d(0, 0, 0);
  }
}
</style>
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
