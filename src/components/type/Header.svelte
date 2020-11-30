<style lang="scss">
  @import "src/styles/type";
  @import "src/styles/tokens";
  h1 {
    margin: 2.5rem 0 1rem 0;
    @include type-style($type-header);
    &:first-child {
      margin-top: 0;
    }
  }
</style>

<h1>
  <slot />
</h1>
