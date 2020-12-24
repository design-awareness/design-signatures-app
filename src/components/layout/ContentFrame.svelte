<style lang="scss">
  @import "src/styles/tokens";
  .content-frame {
    margin: 0;
    padding: $content-frame-pad;
  }
</style>

<div class="content-frame">
  <slot />
</div>
