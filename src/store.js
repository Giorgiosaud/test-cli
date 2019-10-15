import Vuex from 'vuex';

export default new Vuex.Store({
  state: {
    Afps: [
      {
        id: 'Capital',
        name: 'AFP Capital',
      },
      {
        id: 'Cuprum',
        name: 'AFP Cuprum',
      },
      {
        id: 'Habitat',
        name: 'AFP Habitat',
      },
      {
        id: 'Modelo',
        name: 'AFP Modelo',
      },
      {
        id: 'Planvital',
        name: 'AFP Planvital',
      },
      {
        id: 'Provida.',
        name: 'AFP Provida',
      },
      {
        id: 'INP',
        name: 'INP',
      },
    ],
    apv: {
      regime: '',
      subscriptionType: '',
      prevision: '',
      workerType: '',
      amount: '',
      bank: '',
      transferId: '',
      amountType: '',
      fromDate: '',
      endDate: '',
      mutualFunds: [],
    },
    // apvs: null,
    bounders: {},
    citiesAndCommunes: [],
    curtainElement: '',
    dates: ['', ''],
    // discountType: '',
    discountTypes: [
      {
        id: 'clp',
        label: 'CLP',
      },
      {
        id: 'uf',
        label: 'UF',
      },
    ],
    employer: {
      address: '',
      commune: '',
      city: '',
      companyName: '',
      email: '',
      rrhhManager: '',
      phone: '',
      rut: '',
      region: '',
    },
    errorApi: false,
    graphicData: [],
    isApvSigned: true,
    isMobileApp: /; Modyo_App_Shell/.test(navigator.userAgent),
    landing: null,
    lastDiscounts: [],
    lastDiscountsError: false,
    loadingApvs: true,
    modalComponent: '',
    mode: '',
    mutualFundsToInvest: [],
    numeroDeFolio: '123123A',
    regions: [],
    selectedSuscriptionTitles: {
      DD: 'Depósito Directo',
      DC: 'Depósito Convenido',
      DS: 'Descuento Sistemático',
    },
    selectedFromAccount: '',
    selectedFund: '',
    subscribedContractsError: false,
    selectedBank: {},
    subscribedContracts: [],
    subscribedContractsLoading: true,
    lastDiscountsLoading: true,
    suscriptions: [],
    TypesOfWorkers: [
      {
        id: 'independiente',
        name: 'Independiente',
      },
      {
        id: 'dependiente',
        name: 'Dependiente',
      },
    ],
    paymentWindow: '',
    lock: {
      employerRut: true,
      companyName: true,
      searchByRut: true,
      searchByName: true,
      city: true,
      commune: true,
      rrhhManager: true,
      phone: true,
      email: true,
      address: true,
    },
  },
  getters: {
    transferId(state) {
      return state.apv.transferId;
    },
    selectedBankCode(state) {
      return state.apv.bank;
    },
    apvContractInfo(state) {
      const apv = _.pickBy(state.apv, el => el !== '' || el !== null);
      const employer = _.pickBy(state.employer, el => el !== '' || el !== null);
      return {
        apv,
        employer,
      };
    },
    dates(state) {
      return [state.apv.fromDate, state.apv.endDate];
    },
    investmentListFullData(state) {
      return state.mutualFundsToInvest.filter(fund => fund.amount > 0 || fund.percentage > 0)
        .map(fund => ({
          nemo: fund.nemo,
          clp: fund.clp,
          uf: fund.uf,
          amount: fund.amount,
          name: fund.name,
          percentage: fund.percentage,
        }));
    },
    investmentList(state) {
      return state.mutualFundsToInvest.filter(fund => fund.amount > 0 || fund.percentage > 0)
        .map((fund) => {
          const resultFund = {};
          switch (state.apv.amountType) {
            case 'uf':
              resultFund.value = fund.uf;
              resultFund.nemo = fund.nemo;
              resultFund.name = fund.name;
              break;
            case 'clp':
              resultFund.value = fund.clp;
              resultFund.nemo = fund.nemo;
              resultFund.name = fund.name;
              break;
            default:
              break;
          }
          return resultFund;
        });
    },
    investedAmount(state, getters) {
      return getters.investmentList.reduce((accum, current) => {
        let sum = accum;
        sum += parseFloat(current.value);
        return sum;
      }, 0);
    },
    selectedSubscription(state) {
      return state.selectedSuscription;
    },
    toInvestAmount(state, getters) {
      return Math.round((state.apv.amount - getters.investedAmount) * 100) / 100;
    },
  },
  mutations: {
    SET_SUSCRIBED_CONTRACTS_LOADING(state, loadingStatus) {
      state.subscribedContractsLoading = loadingStatus;
    },
    SET_LAST_DISCOUNTS_LOADING(state, loadingStatus) {
      state.lastDiscountsLoading = loadingStatus;
    },
    SET_NUMERO_DE_FOLIO(state, numero) {
      state.numeroDeFolio = numero;
    },
    SET_SELECTED_BANK_CODE(state, bankCode) {
      state.apv.bank = bankCode;
    },
    SET_OPERATION_CODE(state, data) {
      state.apv.transferId = data;
    },
    SET_PAYMENT_WINDOW(state, data) {
      state.paymentWindow = data;
    },
    SET_AMOUNT_TYPE(state, type) {
      state.apv.amountType = type;
    },
    SET_APVS(state, apvs) {
      state.apvs = apvs.map((apv) => {
        const newApv = apv;
        newApv.percentage = 0;
        return newApv;
      });
    },
    SET_APV_SIGNED_STATUS(state, status) {
      state.isApvSigned = status;
    },
    SET_BOUNDERS(state, bounders) {
      state.bounders = bounders;
    },
    SET_CITIES_AND_COMMUNES(state, cities) {
      state.citiesAndCommunes = cities;
    },
    SET_DATES(state, dates) {
      state.apv.fromDate = dates[0];
      state.apv.endDate = dates[1];
    },
    SET_LANDING(state, json) {
      state.landing = json;
    },
    SET_MUTUAL_FUNDS_TO_INVEST(state, data) {
      state.mutualFundsToInvest = data;
    },
    SET_PREVISION(state, prevision) {
      state.apv.prevision = prevision;
    },
    SET_TOTAL_INVEST_AMOUNT(state, amount) {
      state.apv.amount = amount;
    },
    SET_SELECTED_AMOUNT_TYPE(state, type) {
      state.apv.amountType = type;
    },
    SET_REGIONS(state, counties) {
      state.regions = counties;
    },
    SET_SELECTED_SUSCRIPTION(state, suscription) {
      state.apv.subscriptionType = suscription;
    },
    SET_DISCOUNT_TYPE(state, type) {
      state.discountType = type;
    },
    SET_CURTAIN_ELEMENT(state, step) {
      state.curtainElement = step;
    },
    SET_REGIME(state, regime) {
      state.apv.regime = regime;
    },
    SET_EMPLOYER_DATA(state, payload) {
      Object.assign(state.employer, payload);
    },
    SET_FUND_DATA(state, payload) {
      const mutualfund = state.mutualFundsToInvest.find(fund => fund.nemo === payload.nemo);
      mutualfund[payload.amountType] = payload.amount;
      mutualfund.amount = payload.amount;
      mutualfund.percentage = payload.percentage;
    },
    SET_LAST_DISCOUNTS(state, discounts) {
      state.lastDiscounts = discounts;
    },
    SET_SUBSCRIBED_CONTRACTS(state, subscribedContracts) {
      state.subscribedContracts = subscribedContracts;
    },
    SET_LAST_DISCOUNTS_ERROR(state, lastDiscountError) {
      state.lastDiscountError = lastDiscountError;
    },
    SET_SUBSCRIBED_CONTRACTS_ERROR(state, suscribedDiscountsError) {
      state.subscribedContractsError = suscribedDiscountsError;
    },
    SET_LOADING_APVS(state, data) {
      state.loadingApvs = data;
    },
    SET_MODE(state, data) {
      state.mode = data;
    },
    SET_RENTA_IMPONIBLE(state, amount) {
      state.apv.income = amount;
    },
    SET_MODAL_COMPONENT(state, component) {
      state.modalComponent = component;
    },
    SET_SELECTED_FUND(state, fund) {
      state.selectedFund = fund;
    },
    SET_GRAPHIC_DATA(state, data) {
      state.graphicData = data;
    },
    SET_APV_INVESTMENT_FUNDS(state, investmentList) {
      state.apv.mutualFunds = investmentList;
    },
    SET_WORKER_TYPE(state, wt) {
      state.apv.workerType = wt;
    },
    SET_LOCK_STATUS(state, { field, status }) {
      state.lock[field] = status;
    },
  },
  actions: {
    DEFINE_MEDIA_SCREEN(context) {
      return new Promise((resolve) => {
        if (window.matchMedia('(max-width: 768px)').matches) {
          context.commit('SET_MODE', 'simple');
        } else {
          context.commit('SET_MODE', 'multiple');
        }
        resolve();
      });
    },
    GET_LANDING() {
      return axios_modyo_json.get('/posts/lading-apv.json')
        .then(json => json)
        .catch((err) => { throw err; });
    },
    GET_PAYMENT_STATUS(context, payload) {
      return axios_api.get('/payments/status', {
        params: payload,
      })
        .then(response => (response))
        .catch((err) => {
          throw err;
        });
    },
    SEND_APV_NOTIFICATION(context, payload) {
      return axios_api.post('/apv/dd_notifications', payload);
    },
    GET_SUSCRIPTIONS(context) {
      return new Promise((resolve) => {
        context.state.suscriptions = [
          {
            title: 'Descuento sistemático vía empleador',
            description: 'Este descuento se puede realizar de manera indefinida, revocándolo cuando estime conveniente, o por los meses que usted quiera.',
            selectionTitle: 'Nuevo Descuento',
            type: 'DS',
            successMessage: 'Suscripción Realizada',
            errorMessage: 'Falló al realizar Suscripción',
          },
          {
            title: 'Depósito convenido',
            description: 'Puede acordar con su empleador un depósito en una fecha determinada.',
            selectionTitle: 'Nuevo Depósito',
            type: 'DC',
            successMessage: 'Depósito Realizado',
            errorMessage: 'Falló al realizar Depósito',
          },
        ];
        if (!/; Modyo_App_Shell/.test(navigator.userAgent)) {
          context.state.suscriptions.splice(1, 0, {
            title: 'Depósito directo',
            selectionTitle: 'Nuevo Depósito',
            description: 'Realice un depósito directo de APV desde su Cuenta Corriente a LarrainVial.',
            type: 'DD',
            successMessage: 'Depósito Realizado',
            errorMessage: 'Falló al realizar Depósito',
          });
        }
        resolve();
      });
    },
    GET_CITIES_AND_COMMUNES(context) {
      return axios_api.get('/address_resources/cities_and_communes')
        .then((response) => {
          response.data.data.cities.push('OTRA');
          context.commit('SET_CITIES_AND_COMMUNES', response.data.data);
        }, () => {
          context.state.errorApi = true;
        });
    },
    GET_REGIONS(context) {
      return axios_api.get('/address_resources/regions')
        .then((response) => {
          context.commit('SET_REGIONS', response.data.data);
        }, () => {
          context.state.errorApi = true;
        });
    },
    GET_EMPLOYER_DATA(context, params) {
      const queryParams = (params.searchBy === 'rut') ?
        { employerRut: params.searchField } :
        { name: params.searchField };
      return axios_api.get('apv/employers', { params: queryParams })
        .then((response) => {
          if (response.data.data.length) {
            return response.data.data;
          }
          throw new Error('No data Found');
        })
        .catch((err) => {
          throw err;
        });
    },
    GET_LAST_DISCOUNTS(context) {
      return axios_api.get('/apv/last_discounts')
        .then((response) => {
          context.commit('SET_LAST_DISCOUNTS', response.data.data);
        })
        .catch((error) => {
          context.commit('SET_LAST_DISCOUNTS_ERROR', error.response.data.error);
        });
    },
    GET_SUBSCRIBED_CONTRACTS(context) {
      return axios_api.get('/apv/subscribed_contracts')
        .then((response) => {
          context.commit('SET_SUBSCRIBED_CONTRACTS', response.data.data);
        })
        .catch((error) => {
          context.commit('SET_SUBSCRIBED_CONTRACT_ERROR', error.response.data.error);
        });
    },
    GET_APVS(context) {
      context.commit('SET_LOADING_APVS', true);
      return axios_api.get('/apv')
        .then((response) => {
          const mutualFundsToInvest = response.data.data.mutualFunds.map((fund) => {
            const newFund = fund;
            newFund.amount = 0;
            newFund.percentage = 0;
            newFund.uf = 0;
            newFund.clp = 0;
            newFund.nemoSiga = fund.siga;
            newFund.docUrl = fund.docUrl;
            newFund.risk = fund.risk;
            newFund.serie = fund.serie;
            newFund.day = fund.profitDay;
            newFund.month = fund.profitCumulativeMonth;
            newFund.lastMonth = fund.profitLast30;
            newFund.trimester = fund.profitLast90;
            newFund.year = fund.profitCumulativeYear;
            newFund.lastYear = fund.profitLastYear;
            return newFund;
          });
          context.commit('SET_MUTUAL_FUNDS_TO_INVEST', mutualFundsToInvest);
          context.commit('SET_BOUNDERS', response.data.data.meta);
        })
        .catch((error) => {
          throw error;
        })
        .finally(() => {
          context.commit('SET_LOADING_APVS', false);
        });
    },
    GET_GRAPHIC_DATA(context, payload) {
      context.commit('SET_GRAPHIC_DATA', []);
      return axios_api.get(`/mutual_funds/graphics/${payload.nemo}`, { params: payload })
        .then((response) => {
          context.commit('SET_GRAPHIC_DATA', response.data);
          return response.data;
        })
        .catch((err) => {
          throw err;
        });
    },
    SEND_CONTRACT(context, payload) {
      return axios_api.post('apv/subscription_contract', payload)
        .then(response => response)
        .catch((err) => {
          throw err;
        });
    },
    UNLOCK_ALL_FORM_FIELDS(context) {
      return new Promise((resolve) => {
        const keys = Object.keys(context.state.lock);
        keys.forEach((key) => {
          context.commit('SET_LOCK_STATUS', { field: key, status: false });
        });
        resolve();
      });
    },
    LOCK_ALL_FORM_FIELDS(context) {
      return new Promise((resolve) => {
        const keys = Object.keys(context.state.lock);
        keys.forEach((key) => {
          context.commit('SET_LOCK_STATUS', { field: key, status: true });
        });
        resolve();
      });
    },
    CLEAR_EMPLOYER_DATA(context) {
      return new Promise((resolve) => {
        const keys = Object.keys(context.state.employer);
        const obj = {};
        keys.forEach((key) => {
          obj[key] = '';
        });
        context.commit('SET_EMPLOYER_DATA', obj);
        resolve();
      });
    },
    IS_APV_SIGNED(context) {
      return axios_api.get('/apv/contract_status', {
        params: {
          subscriptionType: context.state.apv.subscriptionType,
          regime: context.state.apv.regime,
        },
      })
        .then((response) => {
          context.commit('SET_APV_SIGNED_STATUS', response.data.data.signed);
        })
        .catch((error) => {
          throw error;
        });
    },
  },
});
