<template>
  <div class="error-list d-flex align-items-center flex-column justify-content-center">
    <span class="circular-cover d-flex align-items-center justify-content-center">
      <i class="mdi mdi-close"/>
    </span>
    <slot name="errorTitle"/>
    <slot name="errorText">
      <h4>{{ printError(errorRequest.code) }}</h4>
    </slot>
    <p class="text-muted">Código: {{ errorRequest.code||errorRequest.statusCode }}</p>
  </div>
</template>
<script>
export default {
  name: 'ErrorHandler',
  props: {
    'error-request': {
      type: [Object, Boolean],
      default: false,
    },
  },
};
</script>
