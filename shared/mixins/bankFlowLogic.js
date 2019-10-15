import { banks } from '../variables';

export default {
  data() {
    return {
      url: 'https://www.larrainvial.com/',
      banks,
      selectedBank: {},
      rut: window.liquid.user.rut,
      checkPaymentIteration: 0,
      checkPaymentIterationTime: 4000,
      checkPaymentMaxTimes: 74,
    };
  },
  computed: {
    rutMain() {
      return this.rut.split('-')[0];
    },
    rutValidator() {
      return this.rut.split('-')[1];
    },
    transferId() {
      return this.$store.getters.transferId;
    },
    paymentWindow() {
      return this.$store.state.paymentWindow;
    },
    selectedBankCode() {
      return this.$store.getters.selectedBankCode;
    },
    paramsBase() {
      return `?strCodOp=${this.transferId}&strRUT=${this.rutMain}&strCuenta=${this.selectedToAccountNumber}`;
    },
    paramMonto() {
      return `&strMonto=${this.investedAmount}`;
    },
    paramDv() {
      return `&strDV=${this.rutValidator}`;
    },
    paramNew() {
      return '&NewSitioPrivado=true';
    },
    paramsBCI() {
      return `Ident=Abono_Banco_BCI&monto=${this.investedAmount}&pagret=http://www.larrainvial.com/SitioPrivado/cliente/PagoElectronico/DetalleAbonoV2.asp&costo=0&banco=bci&trx=${this.transferId}&UrlPreIngreso=https://www.bci.cl/pagoswls/PagueDirecto?paso=5&Convenio=14934`;
    },
    service() {
      let service;
      switch (this.selectedBankCode) {
        case 'CHILE':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoChile.asp${this.paramsBase}`;
          break;
        case 'BBVA':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoBBVA.asp${this.paramsBase}${this.paramMonto}`;
          break;
        case 'BCI':
          service = 'sitioprivado/Transferencias/trxInicioBancoBCITBANC.aspX';
          if (navigator.appName !== 'Microsoft Internet Explorer') {
            service = 'sitioprivado/Transferencias/trxInicioBancoBCITBANC2.asp';
          }
          service += `?${this.paramsBCI}`;
          break;
        case 'BICE':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoBICE.asp${this.paramsBase}${this.paramMonto}`;
          break;
        case 'ESTADO':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoEstado.asp${this.paramsBase}${this.paramMonto}${this.paramDv}${this.paramNew}`;
          break;
        case 'SANTANDER':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoSantanderSantiago.asp${this.paramsBase}${this.paramMonto}`;
          break;
        case 'ITAU':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoItau.asp${this.paramsBase}${this.paramMonto}`;
          break;
        case 'SCOTIA':
          service = `LVCliente/Transferencias/trxASP/trxInicioScotiaBank.asp${this.paramsBase}${this.paramMonto}`;
          break;
        case 'EDWARDS':
          service = `LVCliente/Transferencias/trxASP/trxInicioBancoChileEDC.asp${this.paramsBase}${this.paramMonto}`;
          break;
        default:
          service = false;
      }
      return service;
    },
    serviceURL() {
      return this.url + this.service;
    },
  },
  methods: {
    openBankWindow() {
      const paymentWindow = window.open(
        this.serviceURL,
        '_blank',
        'sandbox, dependent=1, toolbar=0, titlebar=0, location=0, directories=0, status=0, menubar=0, scrollbars=1, resizable=1, width=700, centerscreen=1, chrome=yes, height=475',
        true,
      );
      this.$store.commit('SET_PAYMENT_WINDOW', paymentWindow);
    },
    initPaymentStatusCheckInterval() {
      this.checkTransactionState = setInterval(() => {
        this.PaymentStatusCheckIteration();
      }, this.checkPaymentIterationTime);
    },
    PaymentStatusCheckIteration() {
      this.checkPaymentStatus().then(() => {
        if (this.checkPaymentIteration > this.checkPaymentMaxTimes ||
          this.paymentWindow.closed) {
          clearInterval(this.checkTransactionState);
          this.onPaymentFlow = false;
          this.$store.dispatch('SET_PAYMENT_WINDOW', null);
        }
        this.checkPaymentIteration += 1;
      });
    },
    checkPaymentStatus() {
      return this.$store.dispatch('GET_PAYMENT_STATUS', {
        id: this.transferId,
        bank: this.selectedBankCode,
      })
        .then((response) => {
          if (response.data.status !== 'success') {
            this.success = false;
          } else {
            this.$store.dispatch('SEND_APV_NOTIFICATION', { apv: this.apv }).then(() => {
              clearInterval(this.checkTransactionState);
              this.onPaymentFlow = false;
              this.success = true;
              this.$store.dispatch('SET_PAYMENT_WINDOW', null);
            });
          }
        });
    },
  },
};
