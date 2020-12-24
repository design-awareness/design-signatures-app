<style lang="scss">
  @import "src/styles/type";
  @import "src/styles/tokens";
  p {
    text-align: center;
    margin: 2.5rem 0 1rem 0;
    @include type-style($type-detail);
    color: $text-secondary-color;
    &:first-child {
      margin-top: 0;
    }
  }
</style>

<p>
  <slot />
</p>
