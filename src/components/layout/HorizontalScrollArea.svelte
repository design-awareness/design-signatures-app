<style lang="scss">
  .outer {
    margin: 0 -1rem;
    overflow-y: auto;
  }

  .inner {
    padding: 1rem;
    width: max-content;
  }
</style>

<div class="outer">
  <div class="inner">
    <slot />
  </div>
</div>
