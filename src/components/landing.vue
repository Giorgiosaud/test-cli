<template>
  <div
    v-if="loadingLanding"
    class="loading">
    <div class="loading-ico"/>
  </div>
  <div
    v-else
    class="row no-gutters">
    <div class="col-12">
      <a
        :href="imgLink"
        target="_blank">
        <img
          :src="imgSource"
          class="img-fluid d-none d-md-block"
          width="100%"
          alt="APV default image">
        <img
          :src="imgSourceMobile"
          class="img-fluid d-md-none"
          width="100%"
          alt="APV default image">
      </a>
    </div>
    <div class="container">
      <div class="row d-flex d-md-none">
        <div class="col-12 py-3">
          <strong>Selecciona un tipo de suscripción para continuar:</strong>
        </div>
        <div class="col-12">
          <button
            v-for="(suscription,indexsubs) in suscriptions"
            :key="indexsubs"
            class="boton-especial"
            @click.prevent="setSubscriptionType(suscription)">
            <div class="boton-especial__contenido">
              <div class="boton-especial__texto">
                <strong >{{ suscription.title }}</strong>
                <div class="font-sm">
                  {{ suscription.description }}
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
      <div>
        <div class="row d-none d-md-flex">
          <div class="container">
            <h2 class="py-3">
              <img
                src="https://larrainvial.modyocdn.com/uploads/3d73e3ab-71f7-431b-b0ad-4107f4ae9278/original/Icono_1.png"
                alt="Mejora tu futura jubilación con la más amplia oferta de productos">
              Mejora tu futura jubilación con la más amplia oferta de productos
            </h2>
            <div class="col-12">
              <ul>
                <li>Asesoria experta y personalizada.</li>
                <li>Puedes manejar tu APV igual que tus inversiones.</li>
                <li>La más amplia variedad de alternativas de inversión:
                puedes invertir tu APV en Fondos Mutuos, Fondos de Inversión, Acciones, Renta Fija, etc.</li>
                <li>Somos los únicos en el mercado con plataforma para inversiones internacionales APV.</li>
              </ul>
            </div>
            <h2 class="py-3">
              <img
                src="https://larrainvial.modyocdn.com/uploads/4fccd360-97c0-48b0-8af2-e5ae3c77d5bb/original/Icono_2.png"
                alt="Mejor inversión mejor jubilación">
              Mejor inversión mejor jubilación
            </h2>
            <div class="col-12">
              <p>¿Sabías que con tu APV puedes llegar a tener el mismo sueldo de hoy al momento de jubilarte?</p>
              <p><a
                href="https://chile.larrainvial.com/simuladorapv/"
                target="_blank">Simula Aquí</a> el monto de tu jubilación con APV</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      landing: {
      },
      loadingLanding: true,
    };
  },
  computed: {
    imgLink() {
      return this.landing.custom_fields.link.value;
    },
    imgSource() {
      return this.landing.covers[1];
    },
    imgSourceMobile() {
      return this.landing.covers[0];
    },
    selectedSubscriptionType() {
      return this.subscriptionType ? 'home' : 'landing';
    },
    suscriptions() {
      return this.$store.state.suscriptions;
    },
  },
  created() {
    this.$store.dispatch('GET_LANDING')
      .then((media) => {
        this.landing = media.data;
      })
      .catch(() => {
        const data = {
          custom_fields: {
            link: {
              id: 50,
              value: 'https://apv.larrainvial.com/',
            },
          },
          covers: [
            'https://larrainvial.modyocdn.com/uploads/f51494b3-02bd-4bfa-87a3-839f6f2397a7/original/APV_banner_03.png',
            'https://larrainvial.modyocdn.com/uploads/2157c6d7-7a0a-4a3e-85a9-6957fb501d32/original/APV_banner_02.png',
          ],
        };
        this.landing = data;
      })
      .finally(() => {
        this.loadingLanding = false;
      });
  },
  methods: {
    setSubscriptionType(suscription) {
      this.$store.commit('SET_SELECTED_SUSCRIPTION', suscription.type);
      gtag('event', 'Click on Tab', { event_category: 'APV', event_label: suscription.title });
    },
  },
};
</script>

<style lang="scss" scoped>
li {
    margin: 1rem 0;
}
h2{
      color: #49beb7;
    font-weight: 500;
    display: flex;
    align-items: center;
    img{
      height: 60px;
      margin-right: 20px;
    }
}
</style>
