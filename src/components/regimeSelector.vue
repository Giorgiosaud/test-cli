<template>
  <div class="d-flex flex-column">
    <div
      id="head"
      class="d-md-none row no-gutters bottom-shadow py-2 py-md-4">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2><strong>{{ selectedSuscription }} -</strong></h2>
          </div>
          <div class="col-12">
            <h4>{{ systematicType }}</h4>
          </div>
        </div>
      </div>
    </div>
    <div
      id="body"
      class="py-4">
      <div class="container">
        <div class="row text-center font-lg py-4" >
          <div
            v-if=" contractType === 'DD' "
            class="col-12 py-md-5 d-none d-md-block">
            <strong>{{ selectedContractTypeDetails.title }}
          </strong></div>
          <div
            v-else
            class="col-12 py-md-5 d-none d-md-block">
            <strong>{{ selectedContractTypeDetails.title }}</strong> – {{ systematicType }}
          </div>
          <div class="col-12 font-sm">
            Selecciona un régimen tributario
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-4 col-lg-3 py-md-2 offset-md-2 offset-lg-3">
            <button
              class="boton-especial"
              @click.prevent="goToRegimenAFlow">
              <div class="boton-especial__contenido">
                <div class="boton-especial__texto">
                  <strong >Régimen A</strong>
                  <div class="font-sm">
                    El Estado aporta un 15% de lo que usted ahorra durante un año, con un tope de 6UTM.
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
          <div class="col-12 col-md-4 col-lg-3 py-md-2">
            <button
              class="boton-especial"
              @click.prevent="goToRegimenBFlow">
              <div class="boton-especial__contenido">
                <div class="boton-especial__texto">
                  <strong>Régimen B</strong>
                  <div class="font-sm">
                    Lo ahorrado se rebaja de la base imponible, disminuyendo el total de impuestos a pagar.
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
        <div class="row text-center">
          <div class="col-12 py-4">
            <a
              href="https://blog.larrainvial.com/educacion-financiera/apv----regimen-a-o-regimen-b"
              target="_blank"
              class="underline">Ver detalle de regímenes</a>
          </div>
        </div>
        <div class="row d-none d-md-flex">
          <div class="col">
            <button
              type="button"
              class="btn btn-link"
              data-dismiss="modal"
              aria-label="Close"
              @click="cancel">
              Cancelar
            </button>
          </div>
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
export default {
  computed: {
    systematicType() {
      if (this.$store.state.discountType === 'unlimited') {
        return 'Indefinido';
      }
      return 'Temporal';
    },
    selectedContractTypeDetails() {
      return this.$store.state.suscriptions.find(sus => sus.type === this.contractType);
    },
    contractType() {
      return this.$store.state.apv.subscriptionType;
    },
    selectedSuscription() {
      return this.$store.state.selectedSuscriptionTitles[this.$store.state.apv.subscriptionType];
    },
  },
  methods: {
    cancel() {
      this.$store.commit('SET_CURTAIN_ELEMENT', null);
      this.$store.commit('SET_DISCOUNT_TYPE', null);
    },
    goToRegimenAFlow() {
      this.$store.commit('SET_REGIME', 'A');
      if (this.contractType === 'DD') {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'mini-form');
      } else {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'full-form');
      }
    },
    goToRegimenBFlow() {
      this.$store.commit('SET_REGIME', 'B');
      if (this.contractType === 'DD') {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'mini-form');
      } else {
        this.$store.commit('SET_CURTAIN_ELEMENT', 'full-form');
      }
    },
  },
};
</script>
<style lang="scss">
button.close {
  cursor: pointer;
}
@media (max-width: 768px) {
  div#curtain {
    position: absolute;
  }
}
</style>
