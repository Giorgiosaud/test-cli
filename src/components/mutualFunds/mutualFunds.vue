<template>
  <div id="apv-invest">
    <div
      v-if="loadingApvs"
      class="loading">
      <div class="loading-ico"/>
    </div>
    <error-request
      v-else-if="errorRequest"
      :error-request="errorRequest"
      class="py-4 h-100"/>
    <component
      v-else
      :is="mode"
      class="h-100 cont_mutuals"/>
  </div>
</template>

<script>
import Modal from '../../../shared/global_components/modal';
import Multiple from './multiple';
import Simple from './simple';
import investFromBank from '../../../shared/global_components/investFlow/investFromBank';
import investVoucher from '../../../shared/global_components/investFlow/investVoucher';
import investConfirmation from '../../../shared/global_components/investFlow/investConfirmation';
import selectDestinationAccount from '../../../shared/global_components/rescueFlow/selectDestinationAccount';
import multipleDetailFund from './multipleDetailFund';
import errorRequest from '../../../shared/global_components/errorRequest';

export default {
  name: 'MutualFunds',
  components: {
    Modal,
    errorRequest,
    Multiple,
    Simple,
    investConfirmation,
    investFromBank,
    investVoucher,
    selectDestinationAccount,
    multipleDetailFund,
  },
  data() {
    return {
      errorRequest: false,
      url: window.liquid.url || '#',
      urlActive: '/gestion-de-inversiones/fondos-mutuos',
    };
  },
  computed: {
    loadingApvs() {
      return this.$store.state.loadingApvs;
    },
    modalComponent() {
      return this.$store.state.modalComponent;
    },
    mode() {
      return this.$store.state.mode;
    },
  },
  watch: {
    urlActive(value) {
      if (window.location.pathname.replace('/privado', '') !== value) {
        window.location.href = `/privado${value}`;
      }
    },
  },
  created() {
    this.$store.dispatch('DEFINE_MEDIA_SCREEN');
    this.$store.dispatch('GET_APVS');
    window.onresize = _.debounce(() => {
      this.$store.dispatch('DEFINE_MEDIA_SCREEN');
    }, 500);
    $(document).ready(() => {
      $('.modal')
        .on('hidden.bs.modal', function removeData() {
          $(this)
            .removeData();
        });
    });
  },
  methods: {
    exceedsWithdrawAmount() {
      sendPopup(
        'warning',
        transactionalMessages.mutualFunds.exceedsWithdrawAmount,
      );
    },
  },
};
</script>
<style lang="scss">
  #apv-invest {
    background: #fff;
  }

  #apv-invest > .container {
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  #top-aporte .amount {
    font-size: 25px;
  }

  #stockchart {
    min-height: 400px;
  }

  #sidebar-invest {
    height: 100%;
    max-height: 750px;
    min-height: 750px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    position: relative;
    z-index: 2;
    background: #fff;
  }

  #mutual-funds-detail {
    min-height: 100%;
    background: #f7f9fb;
  }

  #mutual-funds-detail .mutual-funds-footer {
    position: absolute;
    padding-top: 30px;
    background: #f8f9f9;
    bottom:0;
  }

  #mutual-funds-multiple {
    background: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  #totalRescue.form-check-input {
    margin-left: 0;
  }

  .height-limited {
    height: 60vh;
    overflow: auto;
  }
  .select_accounts.v-select .dropdown-toggle{
    padding:15px;
  }
  .input-group-text {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0.375rem 0.75rem;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    text-align: center;
    white-space: nowrap;
    background-color: #e9ecef;
    height: 100%;
  }

  .flex-expand {
    flex: 1;
  }

  .flex-expand-1-5 {
    flex: 1.5;
  }

  .highligted-text {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .confirmation-line {
    min-height: 55px;
  }

  .full-table {
    height: 100%;
    overflow: auto;
  }

  .chart-loader {
    height: 400px;
  }

  .search-box {
    position: relative;
  }

  .search-box:after {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    height: 4px;
    content: "";
    background: -webkit-gradient(
                    linear,
                    left top,
                    left bottom,
                    from(rgba(0, 0, 0, 0.65)),
                    to(transparent)
    );
    background: linear-gradient(
                    to bottom,
                    rgba(0, 0, 0, 0.65) 0%,
                    transparent 100%
    );
    opacity: 0.3;
  }

  .invest-wrapper > .row {
    height: 100%;
  }

  .invest-wrapper > .row > div {
    height: 100%;
  }

  .search-filter {
    border-radius: 50px;
  }

  .titles-multiple-invest {
    padding: 0;
    font-size: 12px;
    color: #555;
    position: relative;
    line-height: 1.2em;
  }

  .titles-multiple-invest li {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .list-invest {
    overflow: auto;
    height: 100%;
  }

  .border-rtl-light {
    border-right: 2px white solid;
    border-top: 2px white solid;
    border-left: 2px white solid;
  }

  .border-top-light {
    border-top: solid white 2px;
  }

  .input-full .input-group,
  .input-full .form-control {
    width: 100%;
    height: 100%;
    background-color: #f6f6f6;
  }

  .form-control:disabled {
    background-color: #f1f3f3;
    cursor: not-allowed;
  }

  .invest-wrapper {
    -webkit-box-flex: 1;
    -ms-flex: 1 auto;
    flex: 1 auto;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    overflow: hidden;
  }

  .invest-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 1rem 2.5rem 1rem 1rem;
    border-bottom: 1px solid #eee;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-size: 14px;
    position: relative;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  //noinspection ALL
  .invest-item:after {
    font-family: "Material Design Icons";
    font-size: 24px;
    line-height: 1;
    position: absolute;
    top: 50%;
    right: 10px;
    display: inline-block;
    content: "\f142";
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    text-align: center;
    opacity: 0.2;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
  }

  .invest-item:hover {
    text-decoration: none;
    background: #f9f9f9;
  }

  .invest-item.active {
    border-left: 4px solid #9b0821;
    background: #f1f1f1;
  }

  .invest-item p {
    width: 80%;
    color: #666;
    padding-right: 1rem;
  }

  .invest-item i {
    font-size: 11px;
    color: #9aaf87;
    background: #d5e8c5;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    margin-left: 8px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .invest-item i.mdi-arrow-down {
    background: #eb7e85;
    color: #a30011;
  }

  .fund-risk {
    color: #fff;
    border-radius: 3px;
    font-weight: bold;
    width: 1.5em;
    height: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .risk-low {
    background-color: #a7cca1;
  }

  .risk-mid {
    background-color: #ccc8a1;
  }

  .risk-high {
    background-color: #cca1a1;
  }

  .filters-invest {
    border-bottom: 5px solid #f1f1f1;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .empty-view {
    min-height: 100%;
    width: 100%;
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    background-image: url(https://cloud.modyocdn.com/uploads/54258f98-7de5-45a1-aed5-f95ff0d55646/original/bg-empty.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-color: #f1f3f3;
  }

  .empty-view .empty-view-txt {
    width: 100%;
    text-align: center;
    padding: 80px 50px;
    background: rgba(255, 255, 255, 0.8);
  }

  .empty-view .empty-view-txt h3 {
    font-size: 40px;
    font-weight: bold;
  }

  .mutual-funds-detail-header {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 1rem 2rem;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    -webkit-box-align: end;
    -ms-flex-align: end;
    align-items: flex-end;
  }

  .mutual-funds-amount-invested {
    text-align: right;
  }

  .mutual-funds-footer:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: -webkit-gradient(
                    linear,
                    left top,
                    left bottom,
                    from(rgba(0, 0, 0, 0.08)),
                    to(transparent)
    );
    background: linear-gradient(
                    to bottom,
                    rgba(0, 0, 0, 0.08) 0%,
                    transparent 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#4d000000', endColorstr='#00000000', GradientType=0);
    z-index: 1;
  }

  .mutual-funds-detail-body {
    padding: 1.5rem 2rem;
  }

  .mutual-funds-specs-item {
    padding: 10px;
    text-align: center;
    margin: 1px;
    max-width: 140px;
  }

  .mutual-funds-specs-item .text-muted {
    font-size: 10px;
  }

  .mutual-funds-detail-footer {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin-top: 20px;
  }

  .btn-outline-secondary {
    border-color: #9eaab5;
  }

  .mutual-funds-client-actual-invested .amount {
    font-size: 20px;
    font-weight: bold;
  }

  .mutual-funds-footer {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 1rem;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .mutual-funds-footer .btn-block {
    margin: 0 1rem;
  }

  .modal-body {
    min-height: 30vh;
    max-height: 90vh;
    position: relative;
  }

  .border-left-dotted {
    background-image: linear-gradient(black 33%, rgba(255, 255, 255, 0) 0%);
    background-position: left;
    background-size: 1px 5px;
    background-repeat: repeat-y;
  }

  .border-bottom-dotted {
    background-image: -webkit-gradient(
                    linear,
                    left top,
                    right top,
                    color-stop(33%, black),
                    color-stop(0%, rgba(255, 255, 255, 0))
    );
    background-image: -webkit-linear-gradient(
                    left,
                    black 33%,
                    rgba(255, 255, 255, 0) 0%
    );
    background-image: -o-linear-gradient(
                    left,
                    black 33%,
                    rgba(255, 255, 255, 0) 0%
    );
    background-image: linear-gradient(
                    to right,
                    black 33%,
                    rgba(255, 255, 255, 0) 0%
    );
    background-position: bottom;
    background-size: 3px 1px;
    background-repeat: repeat-x;
  }

  /* MODAL */

  .title-steps {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .title-steps .steps:after {
    content: "";
    height: 1px;
    width: 80%;
    position: absolute;
    top: 50%;
    left: 0;
    background: #004a75;
  }

  .title-steps h4 {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .title-steps .steps {
    -webkit-box-flex: 1;
    -ms-flex: 1 auto;
    flex: 1 auto;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    margin-left: 2rem;
  }

  .title-steps .steps:after {
    content: "";
    height: 1px;
    width: 80%;
    position: absolute;
    top: 50%;
    left: 0;
    background: #9b0822;
  }

  .title-steps-bank .steps:after {
    content: "";
    height: 1px;
    width: 75%;
    position: absolute;
    top: 50%;
    left: 0;
    background: #9b0822;
  }

  .steps span {
    background: #ccc;
    color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin-left: 0.7rem;
    line-height: 1;
    z-index: 1;
    position: relative;
    font-size: 12px;
  }

  .steps span.active {
    background: #666;
    font-weight: bold;
  }

  .steps span.active:not(:first-child):after {
    content: "";
    height: 1px;
    width: 100%;
    position: absolute;
    top: 50%;
    left: -55%;
    background: #9b0822;
  }

  .select-account-box {
    padding: 3rem 8rem;
  }

  .select-account {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .select-account .select-box {
    -webkit-box-flex: 1;
    -ms-flex: 1 auto;
    flex: 1 auto;
  }

  .available-amount {
    text-align: right;
    padding: 1rem 0;
  }

  .title-fund {
    border-bottom: 1px solid #eee;
  }

  .success-message__ticket {
    width: 50px;
    height: 50px;
    background: #a9d446;
    border-radius: 50%;
    background-clip: padding-box;
    text-align: center;
    line-height: 55px;
    font-size: 24px;
    color: #fff;
    margin: 24px auto;
  }

  .variation-tooltip {
    visibility: hidden;
    position: absolute;
    padding: 8px 16px;
    background: black;
    color: white;
    right: -30px;
    top: 97px;
    border-radius: 19px;
    font-size: 12px;
    -webkit-box-shadow: 0 3px 4px rgba(0, 0, 0, 0.4);
    box-shadow: 0 3px 4px rgba(0, 0, 0, 0.4);
    opacity: 0;
    -webkit-transition: all 300ms;
    transition: all 300ms;
  }

  .variation-tooltip.show {
    visibility: visible;
    opacity: 1;
    -webkit-transition: all 300ms;
    transition: all 300ms;
  }

  .view_mode {
    text-align: right;
    background: #2f4f50;
    padding: 10px;
  }

  .view_mode input[type="radio"] {
    visibility: hidden;
  }

  .view_mode label {
    color: rgba(255, 255, 255, 0.6);
    -webkit-transition: 0.3s;
    transition: 0.3s;
    text-decoration: none;
    margin: 5px 15px;
    padding: 0;
  }

  .view_mode input[type="radio"]:checked + label,
  .view_mode label:hover {
    color: white;
  }

  a.see_docs {
    text-align: center;
    color: #333;
    text-decoration: none;
  }

  a.see_docs i {
    display: block;
    font-size: 30px;
  }

  a.see_docs:hover {
    color: #9b0821;
    text-decoration: none;
  }

  .list-multiple-invest {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: auto;
  }

  ul.list-multiple-invest {
    background: #fff;
    padding: 0;
    overflow: auto;
    height: 370px;
  }

  ul.list-multiple-invest li {
    padding: 10px;
    border-bottom: 1px solid #f1f1f1;
  }

  .risk_block b {
    color: #fff;
    display: inline-block;
    width: 25px;
    border-radius: 5px;
  }

  .low_risk b {
    background: #a7cca1;
  }

  .percentageChange30d {
    color: #bd3737;
  }

  .green {
    color: #40824a;
  }

  .list-multiple-invest input {
    border: none;
  }

  .check_custom {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .check_custom label {
    font-size: 16px;
    font-weight: bold;
    color: #ccc;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    margin: 0;
    cursor: pointer;
  }

  .check_custom label {
    @media screen and (max-width: 1000px) {
      & {
        padding: 10px;
      }

      &:first-child {
        border-radius: 10px 0 0 10px;
      }
      &:last-child {
        border-radius: 0 10px 10px 0;
      }
    }

    &.active {
      color: #616161;
      @media screen and (max-width: 1000px) {
        & {
          background: #f1f1f1;
        }
      }
    }
  }

  .check_custom input[type="checkbox"] {
    position: absolute;
    visibility: hidden;
  }

  .check_custom input[type="checkbox"] + span {
    opacity: 1;
    position: relative;
    width: 60px;
    display: inline-block;
    margin: -10px 5px 0;
    @media screen and (max-width: 1000px) {
      & {
        display: none;
      }
    }
  }

  .check_custom input[type="checkbox"] + span:before {
    content: "";
    display: block;
    background: #fff;
    border: 1px solid #ccc;
    width: 100%;
    height: 30px;
    border-radius: 50px 50px 50px 50px;
    position: absolute;
    top: -10px;
  }

  .check_custom input[type="checkbox"] + span:after {
    content: "";
    display: block;
    background: #9b0821;
    width: 20px;
    height: 20px;
    border-radius: 50px 50px 50px 50px;
    position: absolute;
    left: 60%;
    top: -5px;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    @media screen and (max-width: 1045px) {
      & {
        left: 50%;
      }
    }
    @media screen and (max-width: 1000px) {
      & {
        display: none;
      }
    }
  }

  .check_custom input[type="checkbox"]:checked + span:after {
    left: 5px;
  }

  .view_mode.check_custom {
    justify-content: flex-end;
  }

  .view_mode.check_custom label {
    font-size: 14px;
  }

  .view_mode.check_custom label.active {
    color: #fff;
  }

  .view_mode.check_custom input[type="checkbox"] {
    width: 40px;
  }

  .view_mode.check_custom input[type="checkbox"]:before {
    height: 25px;
    border-radius: 50px 50px 50px 50px;
    position: absolute;
    top: -7px;
  }

  .view_mode.check_custom input[type="checkbox"]:after {
    width: 15px;
    height: 15px;
    left: 20px;
    top: -2px;
  }

  .view_mode.check_custom input[type="checkbox"]:checked:after {
    left: 5px;
  }

  .invest-amount,
  .investments-table {
    transition: opacity 0.5s;
  }

  .wait {
    opacity: 0.5;
  }

  .inest_amount input {
    border: none;
    height: 30px;
    font-size: 20px;
    width: 100%;
    border-bottom: solid 1px #616161;
    padding-bottom: 13px;
    color: #616161;
    background: none;
  }

  .inest_amount input:focus,
  .select-box select:focus {
    outline: none;
  }

  .inest_amount p {
    line-height: 1.2em;
    font-size: 90%;
  }

  .bottom-funds-multiple {
    color: #fff;
    background: #586068;
  }

  .container-mutual-funds-details {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
  }

  .modal-60 .modal-dialog {
    width: 60%;
    max-width: 100%;
  }

  .modal-80 .modal-dialog {
    width: 80%;
    max-width: 100%;
  }

  .mutual-funds-detail-footer-item {
    text-align: center;
    flex: 1;
    min-height: 80px;
  }

  .mutual-funds-specs-item-nominal {
    text-align: left;
    min-width: 150px;
  }

  .mutual-funds-detail-graph__filters {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .mutual-funds-detail-graph__filters--periods {
    display: flex;
    flex: 1;
    margin-right: 3rem;
    align-items: flex-end;
  }

  .mutual-funds-detail-graph__filters--dates {
    display: flex;
  }

  .mutual-funds-detail-graph__filters--date {
    width: 170px;
  }

  .mutual-funds-detail-graph {
    border: 1px solid;
  }

  .mutual-funds-detail-graph__filters--periods .period {
    background: #2f4f50;
    color: #fff;
    align-items: center;
    justify-content: center;
    padding: 0.5em;
    margin-right: 0.5em;
    text-align: center;
  }

  .period label {
    text-align: center;
    display: flex;
    margin: 0;
    padding: 0;
    align-items: center;
    justify-content: center;
  }

  .mutual-funds-detail-header-risk {
    display: flex;
    align-items: center;
    color: #b7c2c2;
    justify-content: center;
  }

  .risk__space {
    display: flex;
    flex-direction: column;
    border-right: solid #2f4f50 1px;
    margin-left: 5px;
  }

  .risk__space:first-child {
    border: none;
  }

  .risk__space:nth-child(2) {
    border-left: solid #2f4f50 1px;
  }

  .risk__state {
    display: flex;
  }

  .risk {
    flex: 1;
    padding: 6px 12px 6px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    margin: 0 5px 0 2px;
  }

  .risk__label {
    text-align: center;
    color: #3f3f3f;
  }

  .risk--label {
    padding-right: 2px;
    color: #2f4f50;
  }

  .risk.selected {
    font-weight: bold;
    color: white;
  }

  .risk--low .risk.selected {
    background: #a7cca1;
  }

  .risk--mid .risk.selected {
    background: #ccc8a1;
  }

  .risk--high .risk.selected {
    background: #cca1a1;
  }

  .mutual-funds-detail-header-risk {
    font-size: 10px;
  }

  .content__button {
    background-color: #294647;
    border-color: #294647;
    border-radius: 0;
    font-weight: bold;
    font-size: 16px;
  }

  button.close.our_header {
    position: absolute;
    top: 5px;
    right: 8px;
    z-index: 2;
  }

  .shadow--box {
    /*box-shadow: 0 4px 2px -2px #7f858b;*/
    background: #f1f3f3;
  }

  .box-transfer__title {
    padding: 1rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    background: #7f858b;
    color: #fff;
    font-weight: 300;
  }

  .input-groupbox-amount-value,
  .warning-amount {
    padding: 0.5rem 0;
    position: relative;
  }

  .warning-amount {
    color: #dcabb3;
  }

  /* CHECKBOX */
  .form-check-inline .form-check-input {
    position: absolute;
  }

  .tit-check {
    border-right: 2px solid #eee;
  }

  .form-check input {
    left: -9999px;
    display: none;
  }

  .form-check:after {
    content: "";
  }

  .form-check label {
    position: relative;
    padding-left: 25px;
  }

  .form-check label:after {
    content: "";
    border: 1px solid #004a75;
    width: 20px;
    height: 20px;
    background: #fff;
    left: 0;
    display: block;
    position: absolute;
    top: -1px;
  }

  .form-check input:checked + label:after {
    background: #004a75;
  }

  .form-check input:checked + label:before {
    position: absolute;
    z-index: 2;
    top: 3px;
    left: 3px;
    color: #fff;
    content: "\F12C";
    display: inline-block;
    font: normal normal normal 24px/1 "Material Design Icons";
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1;
  }

  .cont_mutuals {
    border-bottom: 1px solid #eee;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    overflow: hidden;
  }

  .risk-invest-item {
    background: #a7cca1;
    padding: 5px 10px;
    font-size: 10px;
    font-weight: bold;
    border-radius: 5px;
    color: #fff;
  }

  .risk-invest-item.bg-yellow {
    background: #ccc8a1;
  }

  .risk-invest-item.bg-red {
    background: #cca1a1;
  }

  .box-transfer {
    width: 100%;
  }

  .input-group-addon:not(:last-child) {
    border-right: 0;
    border: none;
  }

  .mh-180 {
    min-height: 180px;
  }

  .mh-220 {
    min-height: 220px;
  }

  .circular-cover {
    display: block;
    font-size: 36px;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    border: 2px solid #ddd;
    color: #999;
  }

  .dotted-bottom.title-inline:after {
    width: 100%;
  }

  .title-inline {
    font-weight: bold;
  }

  .monto-aporte--label {
    font-weight: bold;
  }

  .monto-aporte--amount {
    font-size: 24px;
    font-weight: 300;
  }

  .selector-cuenta-destino--selector .v-select .dropdown-toggle {
    min-height: 36px;
    padding: 0 10px;
    border-radius: 0;
  }

  .transaction-details {
    display: flex;
    flex-direction: column;
  }

  .IE .vs__actions {
    margin-top: 10px;
  }

  .title {
    font-size: 20px;
  }

  .title-inline {
    padding: 26px 0;
    font-size: 18px;
  }

  .bank-selector {
    position: relative;
  }

  .loader {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 2;
    top: 0;
    left: 0;
  }

  .modal-dialog-centered .funds-description {
    border: none;
  }

  .terms a {
    color: #6c6c6c;
  }

  .bg-gris {
    background: #f1f1f1;
  }

  @media (min-width: 480px) {
    .br-1 {
      border-right: 1px solid #ccc;
    }
  }

  @media (max-width: 576px) {
    #apv-invest.modal-dialog {
      height: 100vh;
    }
    #apv-invest.modal-dialog.modal-lg.modal-dialog-centered {
      max-width: 100%;
    }
    .title-steps .steps:after,
    .steps span.active:after {
      display: none;
    }
    .modal-dialog.modal-dialog-centered {
      margin: auto;
    }
  }

  @media (max-width: 768px) {
    #apv-invest.modal-dialog {
      max-width: 100%;
    }
    .terms {
      font-size: 12px;
    }
    #apv-invest {
      height: auto;
    }
    #apv-invest#detail-info .modal-dialog {
      width: 98%;
    }
    #detail-info #mutual-funds-detail.active {
      left: 0;
      position: relative;
      width: 100%;
    }
    #detail-info .close-panel {
      display: none;
    }
    #apv-invest > .container {
      padding: 0;
    }
    #mutual-funds-detail {
      position: fixed;
      top: 0;
      background: #fff;
      width: 100%;
      left: 100%;
      z-index: 99999;
      -webkit-transition: all 0.2s ease-in-out;
      transition: all 0.2s ease-in-out;
      overflow-x: scroll;
      height: 100vh;
    }
    #mutual-funds-detail.active {
      left: 0;
      overflow: auto;
      -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      overflow-x: hidden;
      width: 100%;
    }
    .top-funds-multiple {
      background: #fff;
    }
    .top-funds-multiple .section-divisor {
      border-bottom: 1px solid #eee;
    }
    .title-steps .steps:after {
      width: 45%;
    }

    .list-multiple-invest {
      background: #fff;
    }
    .table-inline {
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      border-bottom: 2px solid #eee;
    }
    .table-inline span {
      display: inline-block !important;
      width: 40%;
      margin-right: 15px;
      font-size: 14px;
    }
    .table-inline .name-table {
      font-size: 16px;
      font-weight: bold;
    }
    .table-inline .form-control-inline-mobile {
      display: inline-block;
      width: 170px;
      border: 1px solid #eee;
    }
    .view_mode {
      text-align: center;
    }

    .filter-graphic-detail {
      overflow-x: scroll;
    }
    .mutual-funds-detail-header {
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      padding: 0.5rem 1rem;
      background: #f9f9f9;
      -webkit-box-align: start;
      -ms-flex-align: start;
      align-items: flex-start;
    }
    .mutual-funds-detail-header-title {
      color: #2f4f51;
    }

    .mutual-funds-detail-header h3 {
      font-size: 21px;
    }
    .mutual-funds-detail-body {
      padding: 1rem 1rem 0;
    }
    .mutual-funds-footer {
      padding: 0;
    }
    .mutual-funds-footer .btn.btn-block {
      padding: 0.5rem 1.2rem;
    }
    .mutual-funds-specs-item {
      padding: 0.5rem;
      flex: 1;
      min-width: 44% !important;
      font-size: 13px;
      margin: 0 5px 7px;
      text-align: center;
      border: solid 1px;
      border-radius: 5px;
    }
    .container-mutual-funds-details {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: center;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      padding: 10px;
    }
    .mutual-funds-specs-item strong {
      margin-left: 1rem;
    }
    .mutual-funds-specs {
      margin-bottom: 1rem;
    }

    a.see_docs {
      display: inline-block;
      padding: 5px;
    }
    a.see_docs i {
      font-size: 24px;
    }
    .close-panel {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 24px;
      display: inline-block;
      padding: 1rem;
      line-height: 1;
    }
    .mutual-funds-footer {
      padding: 0.5rem;
    }
    .mutual-funds-footer .btn-block {
      margin: 0.5rem;
    }
    .modal-open #mutual-funds-detail {
      z-index: 1500;
    }
    .modal-open .modal {
      z-index: 2000;
    }
    .modal-open .modal-backdrop {
      z-index: 1900;
    }
    .modal-open .modal-dialog {
      margin: 0;
      height: 100%;
    }

    .modal-open .modal-body {
      overflow-y: scroll;
      overflow-x: hidden;
      font-size: 14px;
    }
    .select-account-box {
      padding: 2rem;
    }
    .select-account .select-box {
      margin-left: 0;
      margin-top: 1rem;
    }
    .wrapper-steps {
      height: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
    }
    .mutual-funds-detail-footer {
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
    }
    .tabs-chart-mobile ul {
      width: 100%;
    }

    .scroll-y,
    .scroll-y .table-header,
    .table-investments-details,
    .scroll-y .table-footer {
      width: 500px;
    }
    .mutual-funds-detail-header {
      background: #fff;
      padding: 15px 60px 15px 20px;
    }
    .title-steps .steps {
      position: fixed;
      width: 100%;
      left: 0;
      top: 0;
      right: 0;
      margin: 0;
    }
    .title-steps .steps span {
      font-size: 0;
      height: 5px;
      width: 100%;
      display: block;
      border-radius: 0;
      margin: 0 1px 5px;
    }
    .btn_cancelar {
      position: fixed;
      top: 10px;
      right: 5px;
      font-size: 0;
      padding: 0 !important;
    }
    .btn_cancelar:before {
      content: "\F156";
      display: inline-block;
      font: normal normal normal 24px/1 "Material Design Icons";
      text-rendering: auto;
      line-height: inherit;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-size: 24px;
    }
    .modal-footer > :not(:first-child) {
      text-align: center;
      display: flex;
      justify-content: center;
    }
    .modal-footer.reverse > :not(:first-child) {
      flex-direction: column-reverse;
    }
    .border-left-dotted {
      background-image: none;
    }
    .input-groupbox-amount-value .form-control {
      height: 60px;
      font-size: 23px;
    }
    .input-group-addon {
      padding: 0 20px;
    }
    #sidebar-invest {
      max-height: 100%;
    }

    .response__title i {
      display: block;
    }
    .header-description-element:nth-child(2) {
      padding-left: 0;
      border: none;
    }
    .header-description {
      border-bottom: 1px solid #f1f1f1;
    }
  }
</style>
