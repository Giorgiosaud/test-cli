<template>
  <table class="table_investments table_sticky_head">
    <thead class="table_head">
      <tr>
        <th
          v-for="(header, posit) in headers"
          :key="posit"
          @click="reOrderBy(posit)"
        >
          <div
            :class="position(posit)"
            class="header"
          >
            <span>{{ header }}</span>
            <span class="arrows">
              <div
                :class="{'arrow-active':orderBy===posit && orderAsc===true}"
                class="arrow-up"/>
              <div
                :class="{'arrow-active':orderBy===posit && orderAsc===false}"

                class="arrow-down"/>
            </span>
          </div>
        </th>
      </tr>
    </thead>
    <tbody
      v-for="(row, index) in orderedRows"
      :key="index">
      <tr>
        <td
          v-for="(column,key2) in row.columns"
          :key="key2"
          :class="position(key2)"
        >
          <div v-if="!column.currency">{{ prettyPrint(column) }}</div>
          <div v-else-if="column.currency=='clp'">{{ prettyPrint(column) }}</div>
          <div v-else>
            {{ column.valueString }}<br>
            <span class="text-muted">
              {{ column.originValueString }}
            </span>
          </div>

        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td
          v-for="(foot, index) in footer"
          :key="index"
          :class="{'footer-label':index===0,'footer-data':index>0}"
        >
          <div
            v-if="index>0"
            class="value white-space">

            <span v-if="foot.name">{{ foot.name }}</span>
            <span v-if="foot.value">{{ foot.value }}</span>
            <div
              v-if="foot.parent"
              class="label"
              v-html=" printParent(foot.parent)"/>
          </div>


          <div v-else>Resumen</div>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
export default {
  data() {
    return {
      orderBy: null,
    };
  },
  computed: {
    tableDetail() {
      return this.$store.state.tableDetail;
    },
    parentData() {
      return this.$store.getters.parentData;
    },
    headers() {
      return this.tableDetail.headers;
    },
    footer() {
      return this.tableDetail.footer;
    },
    orderedRows() {
      return this.tableDetail.rows;
    },


  },
  methods: {
    position(keys) {
      if (keys >= this.tableDetail.types.length) return false;
      let clase;
      switch (this.tableDetail.types[keys]) {
        case 'string':
        case 'date':
          clase = 'text-left';
          break;
        case 'amount':
        case 'quantity':
        case 'percentage':
        case 'number':
          clase = 'text-right';
          break;
        default:
          clase = 'text-left';
      }
      return clase;
    },
    reOrderBy(keys) {
      if (this.orderBy === keys && this.orderAsc === false) {
        this.orderBy = null;
        this.orderAsc = true;
        return;
      }
      if (this.orderBy === keys) { this.orderAsc = false; return; }
      this.orderBy = keys;
      this.orderAsc = true;
    },
    printParent(parentKey) {
      const parentData = this.parentData[parentKey];
      if (!parentData.currency) {
        return parentData.valueString || parentData;
      } else if (parentData.currency === 'clp') {
        return `${parentData.valueString}`;
      }
      return `${parentData.valueString}<br><span class="text-muted">${parentData.originValueString}</span>`;
    },
    prettyPrint(column) {
      if (column.valueString) return column.valueString;
      if ((typeof column === 'string') || (column instanceof String)) return column;
      return '–';
    },
  },

};
</script>
<style lang="scss" scoped>
table.table_investments {
  min-width: 100%;
  font-size: inherit;
  th {
    padding: 0.5rem;
  }
  td {
    padding: 0.75rem;
    background: #f0f0f0;
    color: #000;
    font-size: 0.8rem;
    border: none;
    &.footer-data {
      vertical-align: middle;
    }
  }
  tfoot td {
    background: #586068;
    color: #fff;
    padding: 2rem 1rem;
  }
}
</style>
