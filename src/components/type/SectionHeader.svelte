<style lang="scss">
  @import "src/styles/type";
  @import "src/styles/tokens";
  h3 {
    @include type-style($type-section-header);
    margin: 1rem 0;
    text-align: center;
    text-transform: uppercase;
    &:first-child {
      margin-top: 0;
    }
  }
</style>

<h3>
  <slot />
</h3>
