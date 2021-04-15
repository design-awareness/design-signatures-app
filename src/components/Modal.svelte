<script lang="ts">
  import Button from "./Button.svelte";
  import Header from "./type/Header.svelte";

  export let visible = true;
  export let status: string | null = null;
  export let title: string | null = null;
  export let closeWithScrim = true;
  export let maxWidth = false;

  export let buttons: {
    label: string;
    onClick: (arg0: Event) => void;
    icon?: {
      body: string;
    };
    disabled?: boolean;
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

{#if visible}
  <div role="dialog" aria-labelledby="dialog__Title" use:inject>
    <div class="scrim" on:click={() => closeWithScrim && (visible = false)} />
    <div class="modal" class:maxWidth>
      {#if status}
        <div class="status">{status}</div>
      {/if}
      <div class="content-container">
        {#if title}
          <div id="dialog__Title">
            <Header>{title}</Header>
          </div>
        {/if}
        <slot />
        {#if buttons.length}
          <div class="button-group" class:one={buttons.length === 1}>
            {#each buttons as { label, onClick, icon, disabled }}
              <Button small on:click={onClick} {disabled} {icon}>{label}</Button
              >
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @import "src/styles/tokens.scss";
  @import "src/styles/type.scss";

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
    border-radius: $modal-border-radius;
    overflow-y: auto;
    box-shadow: $modal-shadow;
    &.maxWidth {
      width: $max-width;
    }
  }
  .content-container {
    padding: $modal-padding-vertical $modal-padding-horizontal;
  }
  .button-group {
    margin-top: $block-vertical-spacing;
    display: flex;
    justify-content: space-between;
    &.one {
      justify-content: center;
    }
  }

  .status {
    background: $modal-status-background;
    color: $modal-status-text;
    @include type-style($type-modal-status);
    text-align: center;
  }
</style>
