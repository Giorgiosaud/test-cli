<template class=" discount-list-box">
  <div
    v-if="loading"
    class="loading">
    <div class="loading-ico"/>
  </div>
  <error-request
    v-else-if="error"
    :error-request="error"
    class="text-center py-3 col-12"
  >
    <span
      slot="errorTitle"
      class="py-2">{{ errorTitle }}</span>
  </error-request>
  <div
    v-else-if="discounts.length"
    class="container pb-4">
    <b class="d-none d-md-flex py-3">{{ title }}</b>
    <div class="table-responsive">
      <table class="table tabla-descuentos">
        <thead>
          <tr>
            <th
              v-for="(discountTitle, discountTitleIndex) in columns"
              :key="discountTitleIndex"
              :class="discountTitle.class||'text-left'"
            >{{ discountTitle.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(discount, index) in discounts"
            :key="index">
            <td
              v-for="(key,indexKey) in columns"
              :class="key.class||'text-left'"
              :key="indexKey">
              <div v-if="key.label === 'document' && discount.otlParams">
                <a
                  :disabled="isInQueue(discount.otlParams)"
                  href="#"
                  class="ver-pdf"
                  @click.prevent="showDocumentPDF('/apv/subscribed_otl',
                                                  discount.otlParams,
                                                  `contract ${discount['contractId']}.pdf`)">
                  ver PDF
                </a>
              </div>
              <div v-else>
                <span v-if="key.prefix && discount[key.label] ">{{ key.prefix }}</span>{{
                discount[key.label] }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    v-else
    class="no-data col-12 py-5 top-shadow inverted-shadow">
    <div class="title">{{ title }}</div>
    <div class="sub-title"><p><i>{{ noItemsBody }}</i></p></div>
  </div>
</template>

<script>
import errorRequest from '../../shared/global_components/errorRequest';
import { otl } from '../../shared/mixins';

export default {
  name: 'DiscountList',
  components: {
    errorRequest,
  },
  mixins: [otl],
  props: {
    error: {
      type: [Object, Boolean],
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    discounts: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: 'Últimos Movimientos',
    },
    errorTitle: {
      type: String,
      default: 'Error en Últimos Movimientos',
    },
    noItemsBody: {
      type: String,
      default: 'Por el momento no se han realizado descuentos.',
    },
  },
  computed: {
    discountKeys() {
      if (this.discounts[0]) {
        return Object.keys(this.discounts[0]);
      }
      return [];
    },
  },
};
</script>

<style lang="scss" scoped>
.table thead th {
  white-space: normal;
}

.table {
  font-size: 14px;
  table-layout: fixed;
}

.loading {
  min-height: 150px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  opacity: 0.3;
}

.sub-title {
  text-align: center;
  color: #5c5c5c;
}

.tabla-descuentos td {
  max-width: 100%;
  white-space: normal;
}

a.ver-pdf {
  font-size: 0.9rem;
  border: solid 1px #004a75;
  padding: 0.4rem;
  border-radius: 5px;

  &:hover {
    background: #004a75;
    color: #fff;
  }
}

.max-width-limited {
  max-width: 190px;
  white-space: normal;
}
</style>
