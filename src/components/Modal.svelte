<script lang="ts">
  import Button from "./Button.svelte";
  import Header from "./type/Header.svelte";

  export let visible = true;
  export let title: string = null;
  export let closeWithScrim = true;
  export let maxWidth = false;

  export let buttons: {
    label: string;
    onClick: (arg0: Event) => {};
  }[] = [];

  function inject(node: HTMLElement) {
    document.body.appendChild(node);

    return {
      destroy() {
        node.remove();
      },
    };
  }
</script>

<style lang="scss">
  @import "src/styles/tokens.scss";

  .scrim {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(black, $modal-scrim-opacity);
    z-index: 1000;
  }

  .modal {
    position: fixed;
    left: 50%;
    top: 50%;
    width: max-content;
    min-width: #{m}in(
        $modal-min-width,
        calc(100% - #{$modal-min-gap-horizontal * 2})
      );
    $max-width: calc(100% - #{$modal-min-gap-horizontal * 2});
    max-width: $max-width;
    max-height: calc(100% - #{$modal-min-gap-vertical * 2});
    transform: translate(-50%, -50%);
    z-index: 1001;
    background-color: $modal-background-color;
    padding: $modal-padding-vertical $modal-padding-horizontal;
    border-radius: $modal-border-radius;
    overflow-y: auto;
    box-shadow: $modal-shadow;
    &.maxWidth {
      width: $max-width;
    }
  }
  .button-group {
    margin-top: $block-vertical-spacing;
    display: flex;
    justify-content: center;
  }
</style>

{#if visible}
  <div role="dialog" aria-labelledby="dialog__Title" use:inject>
    <div class="scrim" on:click={() => closeWithScrim && (visible = false)} />
    <div class="modal" class:maxWidth>
      {#if title}
        <div id="dialog__Title">
          <Header>{title}</Header>
        </div>
      {/if}
      <slot />
      {#if buttons.length}
        <div class="button-group">
          {#each buttons as { label, onClick }}
            <Button on:click={onClick}>{label}</Button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}
