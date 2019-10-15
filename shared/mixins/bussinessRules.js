const bussinessRules = {
  data() {
    return {
      bussinessRules: localStorage.getItem('bussinessRules'),
      isOpenedByBR: localStorage.getItem('openedByBR'),
      redirectPath: localStorage.getItem('actualPlace'),
    };
  },
  computed: {
    bussinessRulesParsed() {
      return JSON.parse(this.bussinessRules);
    },
    ruleIndex() {
      return this.bussinessRulesParsed.findIndex(rule => rule.id === this.bussinessRuleId);
    },
    isOpenedByBRTranslated() {
      return (this.isOpenedByBR === '1');
    },
    omitExist() {
      const thisRuleIndex = this.bussinessRulesParsed.findIndex(rule => rule.id === this.bussinessRuleId);
      if (thisRuleIndex !== -1) { return (this.bussinessRulesParsed[this.ruleIndex].restrictivo === '0'); }
      return false;
    },
  },
  methods: {
    omit() {
      const thisRuleIndex = this.bussinessRulesParsed.findIndex(rule => rule.id === this.bussinessRuleId);
      this.bussinessRulesParsed[thisRuleIndex].estado_aplicacion = '1';
      if (this.bussinessRulesParsed[thisRuleIndex].restrictivo === '0') {
        // localStorage.setItem('showSingingRerstritedModal', 1);
        // this.bussinessRulesParsed[thisRuleIndex].estado_larra = '1';
      }
      localStorage.setItem('bussinessRules', JSON.stringify(this.bussinessRulesParsed));
      const nextUnsignedRule = this.bussinessRulesParsed.find(rule => rule.estado_aplicacion === '0');
      if (nextUnsignedRule) {
        window.location.href = `${window.liquid.url}/${nextUnsignedRule.redirect}`;
      } else if (localStorage.getItem('singingRerstrited') === '1') {
        $('#forms-restricted-submitted').modal({
          backdrop: 'static',
          keyboard: false,
          show: true,
        });
      } else {
        if (this.isOpenedByBRTranslated) {
          window.location.href = this.redirectPath;
          return true;
        }
        return true;
      }
      return true;
    },
    saveOrRedirect() {
      const vm = this;
      const thisRuleIndex = _.findIndex(this.bussinessRulesParsed, rule => rule.id === vm.bussinessRuleId);
      this.bussinessRulesParsed[thisRuleIndex].estado_aplicacion = '1';
      if (localStorage.getItem('singingRerstrited') === '0') {
        localStorage.setItem('singingRerstrited', this.bussinessRulesParsed[thisRuleIndex].restrictivo);
      }
      localStorage.setItem('bussinessRules', JSON.stringify(this.bussinessRulesParsed));
      const nextUnsignedRule = _.find(this.bussinessRulesParsed, rule => rule.estado_aplicacion === '0');
      if (nextUnsignedRule) {
        window.location.href = `${window.liquid.url}/${nextUnsignedRule.redirect}`;
      } else if (localStorage.getItem('singingRerstrited') === '1') {
        $('#forms-restricted-submitted').modal({
          backdrop: 'static',
          keyboard: false,
          show: true,
        });
      } else if (this.isOpenedByBRTranslated) {
        window.location.href = this.redirectPath;
      }
    },
  },
};
module.exports = {
  bussinessRules,
};
