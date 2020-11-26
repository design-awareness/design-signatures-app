<script lang="ts">
  let disabled = false;
</script>

<style lang="scss">
  button {
    border: 0;
    margin: 0;
    padding: 0;
    background: none;
    display: block;
    width: 100%;
    text-align: inherit;
    font: inherit;
    border-radius: 0.001px;
  }
</style>

<button on:click {disabled}>
  <slot />
</button>
