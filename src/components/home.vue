<template>
  <div>
    <div class="container" >
      <div class="row  py-2">
        <div
          class="col-12 py-2 d-md-none">
          <span
            class="volver"
            @click="goToLanding"> <i class="mdi mdi-chevron-left"/>Volver </span>
        </div>
        <div
          :class="{'col-2':contractType!=='DD','col-12':contractType==='DD'}"
          class=" d-none d-md-flex align-items-center">
          <p
            class="mb-0 home-title">
            <strong>{{ selectedContractTypeDetails.selectionTitle }}</strong>
          </p>
        </div>
        <div class="col-12 d-md-none discount-type-description">
          <strong v-text="selectedContractTypeDetails.title"/>
          <p v-text="selectedContractTypeDetails.description"/>
        </div>
        <div
          v-if="contractType!=='DD'"
          class="col-12 col-md-5 py-2">
          <button

            class="boton-especial"
            @click.prevent="goToTemporalDiscountFlow">
            <div class="boton-especial__contenido">
              <div class="boton-especial__texto">
                <strong class="">Temporal</strong>
                <div class="font-sm">
                  Se realizarán descuentos mensuales por el periodo que defina
                </div>
              </div>
              <div class="boton-especial__indicador">
                <svg
                  width="26"
                  height="30"
                  viewBox="0 0 26 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.00006 0L0.914062 1.87062L21.0781 19.9526L0.914062 38.0347L3.00006 39.9053L25.2501
                   19.9526L3.00006 0Z"
                    fill="white"/>
                </svg>
              </div>
            </div>
          </button>
        </div>
        <div
          v-if="contractType!=='DD'"
          class="col-12 col-md-5 py-2">
          <button
            class="boton-especial"
            @click.prevent="goToUndefinedDiscountFlow">
            <div class="boton-especial__contenido">
              <div class="boton-especial__texto">
                <strong class="">Indefinido</strong>
                <div class="font-sm">
                  Se realizarán descuentos mensuales de forma indefinida
                </div>
              </div>
              <div class="boton-especial__indicador">
                <svg
                  width="26"
                  height="30"
                  viewBox="0 0 26 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.00006 0L0.914062 1.87062L21.0781 19.9526L0.914062 38.0347L3.00006 39.9053L25.2501
                   19.9526L3.00006 0Z"
                    fill="white"/>
                </svg>
              </div>
            </div>
          </button>
        </div>
        <div
          v-else
          class="col-12 py-2">
          <button
            class="boton-especial"
            @click.prevent="goToUndefinedDiscountFlow">
            <div class="boton-especial__contenido">
              <div class="boton-especial__texto">
                <strong class="">Realizar nuevo depósito</strong>
                <div class="font-sm">
                  Lo puede realizar desde alguna de sus cuentas de LarrainVial o desde su Banco
                </div>
              </div>
              <div class="boton-especial__indicador">
                <svg
                  width="26"
                  height="30"
                  viewBox="0 0 26 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.00006 0L0.914062 1.87062L21.0781 19.9526L0.914062 38.0347L3.00006 39.9053L25.2501
                   19.9526L3.00006 0Z"
                    fill="white"/>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div class="row d-md-none ">
        <div
          id="selectorType"
          class="container">
          <div class="form-group">
            <v-select
              v-model="selectedHistory"
              :options="[
                {label:'Descuentos Suscritos',value:'contractsSuscibed'},
                {label:'Últimos Movimientos',value:'lastMovements'}
              ]"
              index="value"
              class="w-100"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="container mx-0 px-0 px-md-3">
      <div
        v-if="contractType!=='DD'"
        id="suscribed"
        :class="{'d-none':selectedHistory==='lastMovements'}"
        class="row d-md-flex top-shadow shadow-inverted shadow-big">
        <movements-list
          :loading="subscribedContractsLoading"
          :columns="subscribedColumns"
          :discounts="subscribedContracts"
          :error="suscribedContractsError"
          title="Descuentos Suscritos"
          no-items-body="Por el momento no se han suscrito descuentos."
          error-title="Error en Obtención de Descuentos Suscritos"
        />

      </div>
      <div
        id="movements"
        :class="{'d-none':selectedHistory==='contractsSuscibed'}"
        class="row d-md-flex top-shadow shadow-inverted shadow-big"
      >
        <movements-list
          :columns="lastMovementsColumns"
          :discounts="lastDiscounts"
          :error="lastDiscountsError"
          :loading="lastDiscountsLoading"
          title="Últimos Movimientos"
          no-items-body="Por el momento no se han realizado descuentos."
          error-title="Error en Obtención de Últimos Movimientos"
        />

      </div>
    </div>
  </div>
</template>
<script>
import movementsList from './movementsList';

export default {
  components: {
    movementsList,
  },
  data() {
    return {
      selectedHistory: 'contractsSuscibed',
    };
  },
  computed: {
    mode() {
      return this.$store.state.mode;
    },
    subscribedContracts() {
      return this.$store.state.subscribedContracts[this.contractType] || [];
    },
    lastMovementsColumns() {
      if (this.contractType !== 'DD') {
        return [{ title: 'Fecha', label: 'date' },
          { title: 'Nombre Empleador', label: 'employerName' },
          { title: 'Monto', label: 'amount', class: 'text-right' }];
      }
      return [{ title: 'Fecha', label: 'date' },
        { title: 'Monto', label: 'amount', class: 'text-right' }];
    },
    subscribedColumns() {
      if (this.mode === 'multiple') {
        if (this.contractType === 'DC') {
          return [{ title: 'Tipo de dcto', label: 'type' },
            { title: 'Razón Social Empleador', label: 'employerName', class: 'max-width-limited' },
            { title: 'Fecha de suscipción', label: 'date' },
            { title: 'Monto', label: 'amount' },
            { title: 'Estado suscripción', label: 'status' },
            { title: '', label: 'document' },
          ];
        }

        return [{ title: 'Tipo de dcto', label: 'type' },
          { title: 'Razón Social Empleador', label: 'employerName', class: 'max-width-limited' },
          { title: 'Régimen Tributario', label: 'taxRegime', prefix: 'Régimen ' },
          { title: 'Fecha de suscipción', label: 'date' },
          { title: 'Monto', label: 'amount' },
          { title: 'Estado suscripción', label: 'status' },
          { title: '', label: 'document' },
        ];
      }
      return [
        { title: 'Tipo', label: 'type' },
        { title: 'Empleador', label: 'employerName' },
        { title: 'Fecha de suscipción', label: 'date' },
      ];
    },
    lastDiscounts() {
      return this.$store.state.lastDiscounts[this.contractType];
    },
    lastDiscountsError() {
      return this.$store.state.lastDiscountsError;
    },
    subscriptionTypesubscribedContracts() {
      return this.$store.state.subscribedContracts
        .slice(0, 12);
    },
    suscribedContractsError() {
      return this.$store.state.subscribedContractsError;
    },
    selectedContractTypeDetails() {
      return this.$store.state.suscriptions.find(sus => sus.type === this.contractType);
    },
    contractType() {
      return this.$store.state.apv.subscriptionType;
    },
    lastDiscountsLoading() {
      return this.$store.state.lastDiscountsLoading;
    },
    subscribedContractsLoading() {
      return this.$store.state.subscribedContractsLoading;
    },
  },
  created() {
    if (this.subscribedContracts.length || this.lastDiscounts.length) scrollTablePopup(960);
  },
  methods: {

    goToUndefinedDiscountFlow() {
      this.$store.commit('SET_DISCOUNT_TYPE', 'unlimited');
      this.$store.commit('SET_DATES', ['', '']);
      if (this.contractType === 'DD') {
        this.$store.commit('SET_AMOUNT_TYPE', 'clp');
        this.$store.commit('SET_DISCOUNT_TYPE', null);
      }
      if (this.contractType === 'DC') {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'full-form');
        this.$store.commit('SET_REGIME', null);
      } else {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'regime-selector');
      }
    },
    goToTemporalDiscountFlow() {
      if (this.contractType !== 'DD') {
        this.$store.commit('SET_DISCOUNT_TYPE', 'temporal');
      }
      if (this.contractType === 'DC') {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'full-form');
      } else {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'regime-selector');
      }
    },
    goToLanding() {
      this.$store.commit('SET_SELECTED_SUSCRIPTION', null);
    },
  },
};
</script>
<style lang="scss" scoped>
#suscribed,
#movements {
  background: #fafafa;
}
#curtain {
  position: absolute;
}
.home-title {
  font-size: 16px;
}
</style>
