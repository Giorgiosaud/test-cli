const otl = {
  data() {
    return {
      otlDocumentLoading: false,
      downloadingQueue: [],
    };
  },
  methods: {
    isInQueue(otlParams) {
      return !!this.downloadingQueue.find(queue => queue === otlParams);
    },
    addToQueue(params) {
      this.otlDocumentLoading = true;
      this.downloadingQueue.push(params);
    },
    removeFromQueue(params) {
      this.otlDocumentLoading = false;
      this.downloadingQueue.splice(this.downloadingQueue.indexOf(params), 1);
    },
    showDocumentPDF(otlRoute, documentOtlParams = {}, name) {
      this.addToQueue(documentOtlParams);
      axios_api.post(otlRoute, documentOtlParams)
        .then((response) => {
          if (/; Modyo_App_Shell|Mobile|iP(hone|od|ad)/.test(navigator.userAgent)) {
            window.location = `${axios_api.defaults.baseURL}/documents/otl/${response.data.data.otlKey}`;
            this.removeFromQueue(documentOtlParams);
          } else {
            sendPopup('success', transactionalMessages.pdfs.pfdGenerating);
            axios_api({
              url: `documents/otl/${response.data.data.otlKey}`,
              method: 'GET',
              responseType: 'blob',
            })
              .then((responseOTL) => {
                const url = window.URL.createObjectURL(new Blob([responseOTL.data], { type: responseOTL.headers['content-type'] }));
                const link = document.createElement('a');
                link.href = url;
                const docuementName = name || `documento.${responseOTL.headers['content-type'].split('/')[1]}`;
                link.setAttribute('download', docuementName); // or any other extension
                link.setAttribute('target', '_self'); // or any other extension
                document.body.appendChild(link);
                link.click();
                sendPopup('success', transactionalMessages.pdfs.pfdFound);
              })
              .catch(() => {
                sendPopup('warning', transactionalMessages.pdfs.pfdNotFound);
              })
              .finally(() => {
                this.removeFromQueue(documentOtlParams);
              });
          }
        })
        .catch(() => {
          this.removeFromQueue(documentOtlParams);
          sendPopup('warning', transactionalMessages.pdfs.pfdNotFound);
        });
    },

  },
};
module.exports = {
  otl,
};
