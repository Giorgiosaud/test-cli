<template>
  <div
    v-if="isLoading"
    class="loading">
    <div class="loading-ico"/>
  </div>
  <error-request
    v-else-if="apvError"
    :error-request="apvError"
    class="py-5"/>
  <div
    v-else
    id="apv"
    class="cuenta-apv">
    <div class="investment-menu pb-1">
      <div class="bottom-shadow">
        <div class="container d-block d-md-none col-12 form-group py-4 my-0">
          <v-select
            v-model="urlActive"
            :options="links"
            label="title"
            index="url"
          >
            <option
              v-for="(link,index) in links"
              :key="index"
              :value="link.url">{{ link.title }}</option>
          </v-select>
        </div>
        <div class="container d-none d-md-block px-0 mx-auto">
          <ul class="nav nav-tabs-line tab-bar__container order-2 order-lg-1 d-none d-md-flex">
            <li
              v-for="(link,index) in links"
              :key="index"
              class="nav-item">
              <a
                :href="'{{ site.url }}' + link.url "
                :class="{active:link.url === urlActive}"
                class="nav-link">
                {{ link.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <transition
      name="fade"
      mode="out-in">
      <div
        v-if="curtainElement"
        id="curtain"
        key="curtain"
        class="curtain">
        <transition
          name="fade"
          mode="out-in">
          <component
            :is="curtainElement"/>
        </transition>
      </div>
      <div
        v-else
        key="baseElements"
        class="container px-0 mx-auto">
        <div class="row no-gutters">
          <div
            class="d-none d-md-block col-md-4 pt-3 right-shadow">
            <div class="container py-4">
              <h4 class="mb-0"> Seleccione un tipo de suscripción para continuar:</h4>
            </div>
            <ul class="nav flex-column mb-lg-4-5">
              <li
                v-for="(suscription, index) in suscriptions"
                :key="index"
                class="nav-item p-x-2">
                <a
                  :class="{active: subscriptionType === suscription.type}"
                  class="nav-link"
                  @click.prevent="setSelectedSuscription(suscription)">
                  <b>{{ suscription.title }}</b>
                  <p>{{ suscription.description }}</p>
                </a>
              </li>
            </ul>
          </div>
          <div
            class="col-12 col-md-8">
            <transition
              name="fade"
              mode="out-in">
              <keep-alive>
                <component
                  v-if="selectedSubscriptionType==='landing'"
                  :is="selectedSubscriptionType"
                />
              </keep-alive>
            </transition>
            <transition
              name="fade"
              mode="out-in">
              <component
                v-if="selectedSubscriptionType!=='landing'"
                :is="selectedSubscriptionType"
              />
            </transition>
          </div>
        </div>
      </div>
    </transition>
    <modal
      id="modal"
      :is-xl="true">
      <component
        :is="modalComponent"
      />
    </modal>
  </div>
</template>

<script>
import errorRequest from '../shared/global_components/errorRequest';
import Landing from './components/landing';
import Home from './components/home';
import regimeSelector from './components/regimeSelector';
import mutualFunds from './components/mutualFunds/mutualFunds';
import multipleDetailFund from './components/mutualFunds/multipleDetailFund';
import fullForm from './components/fullForm';
import miniForm from './components/miniForm';
import modal from '../shared/global_components/modal';
import singleInvest from './components/APVInvestFlow/singleInvest';
import investConfirmation from './components/APVInvestFlow/investConfirmation';
import prefilledContract from './components/APVInvestFlow/prefilledContract';
import investVoucher from './components/APVInvestFlow/investVoucher';
import investFromBank from './components/APVInvestFlow/investFromBank';
import { menuManager, isProduction } from '../shared/mixins';

export default {
  name: 'Apv',
  components: {
    errorRequest,
    Landing,
    Home,
    regimeSelector,
    fullForm,
    miniForm,
    mutualFunds,
    multipleDetailFund,
    modal,
    singleInvest,
    investConfirmation,
    prefilledContract,
    investVoucher,
    investFromBank,
  },
  mixins: [menuManager, isProduction],
  data() {
    return {
      url: window.liquid.url || '#',
      urlActive: '/gestion-de-inversiones/apv',
      isLoading: true,
      apvError: false,
      isFullWidth: false,
    };
  },
  computed: {
    subscriptionType() {
      return this.$store.state.apv.subscriptionType;
    },
    curtainElement() {
      return this.$store.state.curtainElement;
    },
    suscriptions() {
      return this.$store.state.suscriptions;
    },
    selectedSubscriptionType() {
      return this.subscriptionType ? 'home' : 'landing';
    },
    modalComponent() {
      return this.$store.state.modalComponent;
    },
  },
  watch: {
    urlActive(value) {
      window.location.href = this.url + value;
    },
  },
  created() {
    this.$store.dispatch('GET_SUSCRIPTIONS').then(() => {
      this.isLoading = false;
    });
    this.$store.commit('SET_LAST_DISCOUNTS_LOADING', true);
    this.$store.commit('SET_SUSCRIBED_CONTRACTS_LOADING', true);
    Promise.all([this.$store.dispatch('GET_SUBSCRIBED_CONTRACTS'), this.$store.dispatch('GET_LAST_DISCOUNTS')])
      .finally(() => {
        this.$store.commit('SET_LAST_DISCOUNTS_LOADING', false);
        this.$store.commit('SET_SUSCRIBED_CONTRACTS_LOADING', false);
      });
    $(window).resize(_.debounce(() => {
      this.$store.dispatch('DEFINE_MEDIA_SCREEN');
    }, 500));
    this.$store.dispatch('DEFINE_MEDIA_SCREEN');
    gtag('event', 'Click on Tab', { event_category: 'APV', event_label: 'APV' });
  },
  methods: {
    setSelectedSuscription(suscription) {
      if (suscription.type === this.subscriptionType) {
        this.$store.commit('SET_SELECTED_SUSCRIPTION', null);
      } else {
        this.$store.commit('SET_SELECTED_SUSCRIPTION', suscription.type);
        gtag('event', 'Click on Tab', { event_category: 'APV', event_label: suscription.title });
      }
    },
  },
};
</script>

<style lang="scss">
#apv {
  height: 100%;
  position: relative;
}
#curtain {
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100%;
  background: white;
  z-index: 100;
}
.menu {
  position: relative;
  z-index: 500;
  background: #fff;
}
.nav-item {
  color: #c3c3c3;
  &:hover {
    color: #000;
  }
  a.nav-link {
    &.active {
      color: #000;
      border-color: #990d25;
    }
    b {
      font-size: 18px;
    }
  }
}
.btn-lv {
  display: flex;
  white-space: pre-wrap;
  flex-direction: column;
  border-radius: 0;
  text-align: left;
}
.inverted-shadow {
  &::before {
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.65) 100%
    );
    height: 40px;
  }
}
.font-xl {
  font-size: 36px;
  font-weight: lighter;
}
.font-lg {
  font-size: 18px;
}
.font-sm {
  font-size: 80%;
  font-weight: 400;
  white-space: normal;
}
.from-top-enter-active {
  transition: all 300ms cubic-bezier(1, 0.5, 0.8, 1);
}
.from-top-leave-active {
  transition: all 300ms cubic-bezier(1, 0.5, 0.8, 1);
}
.from-top-enter, .from-top-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-100%);
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.discount-type-description strong {
  font-size: 16px;
}
.discount-type-description p {
  font-size: 12px;
}
.modal-header {
  border-bottom: none !important;
}
@media screen and (min-width: 768px) {
  .btn-lv {
    min-height: 120px;
  }
  .investment-menu {
    position: relative;
  }
  #curtain {
    position: relative;
  }
}
.shadow-big:before {
  height: 40px;
}

.shadow-inverted:before {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.65) 100%
  );
}
#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
}
button.boton-especial {
}

.col-12 {
}

button.boton-especial {
  width: 100%;
  background: #074b73;
  color: white;
  text-align: left;
  min-height: 130px;
  font-size: 16px;
  padding: 15px;
  border: none;
  display: flex;
  cursor: pointer;
}
.boton-especial__contenido {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.boton-especial__texto {
  width: 100%;
}

.boton-especial__indicador {
  display: none;
}
@media screen and (max-width: 767px) {
  .row-mobile {
    margin: 0;
    padding: 0;
  }
  .btn-fix-h {
    min-height: 110px;
  }
  .boton-especial__indicador {
    padding: 0 20px;
    text-align: center;
    display: block;
  }
  button.boton-especial {
    margin-top: 10px;
    min-height: 100px;
  }
}
</style>
