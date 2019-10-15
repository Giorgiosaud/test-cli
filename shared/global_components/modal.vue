<template>
  <div
    id="modal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal"
    aria-hidden="true"
  >
    <div
      :class="classModal"
      class="modal-dialog modal-dialog-centered"
      role="document">
      <slot/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isXl: { type: Boolean, default: false },
    isStatic: { type: Boolean, default: false },
  },
  computed: {
    classModal() {
      return {
        'modal-lg': !this.isXl,
        'modal-xl': this.isXl,
      };
    },
  },
  mounted() {
    const vm = this;
    $('#modal').on('hide.bs.modal', function hideModal() {
      $(this).removeData('bs.modal');
      vm.$store.commit('SET_MODAL_COMPONENT', '');
    });
  },
};
</script>
<style lang="scss">
//colors
$white: #fff;
$color_regal_blue_approx: #004a75;
$color_concrete_approx: #f1f3f3;
$color_celeste_approx: #ccc;
$color_amaranth_approx: #dc3545;
$color_plantation_approx: #294647;

%extend_1 {
  background: $color_concrete_approx;
  color: $color_celeste_approx;
  opacity: 1;
  border-color: $color_concrete_approx;
}

.btn-primary {
  color: $white;
  background-color: $color_regal_blue_approx;
  border-color: $color_regal_blue_approx;
  font-size: 1.1rem;
  &.disabled {
    @extend %extend_1;
  }
  &:disabled {
    @extend %extend_1;
  }
}
.modal-content {
  max-height: 100vh;
  .btn-primary.selected {
    background-color: $color_amaranth_approx;
  }
}
.modal-header {
  padding: 15px;
}
.content__button {
  background-color: $color_plantation_approx;
  border-color: $color_plantation_approx;
  border-radius: 0;
  font-weight: bold;
  font-size: 16px;
}
.modal-dialog {
  &.modal-xl {
    max-width: 860px;
  }
  &.modal-dialog-centered {
    margin: auto;
    height: 100vh;
  }
}
.modal-body {
  overflow: auto;
}
@media screen and(max-width: 768px) {
  & {
    max-width: 100%;
  }
  .modal-body {
    height: 100%;
  }
  .modal-dialog {
    max-width: 100%;
  }
  .modal-content {
    height: 100%;
  }
}
.modal-body {
  min-height: 30vh;
  max-height: 90vh;
  position: relative;
  align-items: center;
  background: $white;
}

.modal-footer {
  border: none;
  background: $white;
}
.bg-gris {
  background: $color_concrete_approx;
}
button.btn.btn-primary {
  border-radius: 0;
}
</style>
