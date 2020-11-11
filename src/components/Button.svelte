<script lang="ts">
  export let disabled = false;
</script>

<style lang="scss">
  button {
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.5rem;
    text-align: center;
    background-color: #f5f5f5;
    border: 0.5px solid #4f4f4f;
    box-sizing: border-box;
    border-radius: 30px;
    padding: 0.5rem 1rem;
    min-width: 8rem;
  }
</style>

<button on:click {disabled}><slot /></button>
