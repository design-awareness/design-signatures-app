<script lang="ts" context="module">
  import type { IconifyIcon } from "../types/IconifyIcon";
  interface OptionDescriptor {
    label: string;
    action: () => void;
    separator?: false;
    icon?: IconifyIcon;
    class?: string;
  }
  interface SeparatorDescriptor {
    separator: true;
  }

  export type PopupMenuDescriptor = (OptionDescriptor | SeparatorDescriptor)[];
</script>

<script lang="ts">
  import caretDownIcon from "@iconify-icons/ic/baseline-keyboard-arrow-down";
  import caretUpIcon from "@iconify-icons/ic/baseline-keyboard-arrow-up";
  import Icon from "@iconify/svelte/dist/Icon.svelte";

  export let alignment: "left" | "right";

  export let label: string;
  export let descriptor: PopupMenuDescriptor;

  let opened = false;
  let id = Math.random().toString(36).substr(2);

  let selectedItem = 0;

  function setFocusOn(i: number) {
    if (i === -1) {
      i = refs.length - 1;
    }
    selectedItem = i;
    setTimeout(() => refs[i]?.focus());
  }

  function setFocusNext(i: number) {
    i++;
    while (i >= refs.length || descriptor[i].separator) {
      if (i >= refs.length) {
        i = 0;
      } else {
        i++;
      }
    }
    setFocusOn(i);
  }

  function setFocusPrevious(i: number) {
    i--;
    while (i < 0 || descriptor[i].separator) {
      if (i < 0) {
        i = refs.length - 1;
      } else {
        i--;
      }
    }
    setFocusOn(i);
  }

  function onButtonKeydown(event: KeyboardEvent) {
    let key = event.key;
    let flag = false;

    switch (key) {
      case " ":
      case "Enter":
      case "ArrowDown":
      case "Down":
        opened = true;
        setFocusOn(0);
        flag = true;
        break;

      case "Esc":
      case "Escape":
        opened = false;
        flag = true;
        break;

      case "Up":
      case "ArrowUp":
        opened = true;
        setFocusOn(-1);
        flag = true;
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function onButtonClick() {
    if (opened) {
      close();
    } else {
      opened = true;
      // setFocusOn(0);
    }
  }

  function close() {
    opened = false;
    button?.focus();
  }

  function dispatch(i: number) {
    close();
    let opt = descriptor[i];
    if (!opt.separator) {
      opt.action();
    }
  }

  const onItemClick = (i: number) => (_: MouseEvent) => dispatch(i);

  const onItemKeydown = (i: number) => (event: KeyboardEvent) => {
    let key = event.key;
    let flag = false;

    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    if (event.shiftKey) {
      if (event.key === "Tab") {
        close();
        flag = true;
      }
    } else {
      switch (key) {
        case " ":
        case "Enter":
          dispatch(i);
          flag = true;
          break;

        case "Esc":
        case "Escape":
          close();
          flag = true;
          break;

        case "Up":
        case "ArrowUp":
          setFocusPrevious(i);
          flag = true;
          break;

        case "Down":
        case "ArrowDown":
          setFocusNext(i);
          flag = true;
          break;

        case "Home":
        case "PageUp":
          setFocusOn(0);
          flag = true;
          break;

        case "End":
        case "PageDown":
          setFocusOn(refs.length - 1);
          flag = true;
          break;

        case "Tab":
          opened = false;
          break;
      }
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const onItemMouseover = (i: number) => () => refs[i]?.focus();

  const refs: (HTMLElement | null)[] = descriptor.map(() => null);
  function setRef(el: HTMLElement, i: number) {
    refs[i] = el;
  }
  let button: HTMLButtonElement | null;
</script>

<div class="popup-container" class:open={opened}>
  <button
    id="{id}_button"
    class="button"
    type="button"
    aria-haspopup="true"
    aria-controls="{id}_menu"
    aria-expanded={opened}
    on:keydown={onButtonKeydown}
    on:click={onButtonClick}
    bind:this={button}
  >
    {label}
    <Icon icon={opened ? caretUpIcon : caretDownIcon} />
  </button>
  <ul
    id="{id}_menu"
    class="menu {alignment}"
    role="menu"
    aria-labelledby="{id}_button"
    style="display: {opened ? 'block' : 'none'}"
  >
    {#each descriptor as item, i}
      {#if item.separator}
        <li class="separator" role="separator" tabindex="-1" />
      {:else}
        <li
          class="item {item.class || ''}"
          role="menuitem"
          tabindex={i === selectedItem ? 0 : -1}
          use:setRef={i}
          on:keydown={onItemKeydown(i)}
          on:click={onItemClick(i)}
          on:mouseover={onItemMouseover(i)}
        >
          {#if item.icon}
            <Icon icon={item.icon} />
          {/if}
          {item.label}
        </li>
      {/if}
    {/each}
  </ul>
  {#if opened}
    <div class="scrim" role="presentation" on:click={close} />
  {/if}
</div>

<style lang="scss">
  @import "src/styles/type.scss";
  @import "src/styles/tokens.scss";

  .popup-container {
    position: relative;
    width: fit-content;
    &.open {
      z-index: 1000;
    }
  }

  .button {
    @include type-style($type-popup-button);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $button-background-color;
    color: $text-primary-color;
    border: $button-border-size solid $button-border-color;
    box-sizing: border-box;
    border-radius: $button-border-radius;
    padding: calc(#{$button-padding-vertical} - #{$button-border-size})
      calc(#{$button-padding-horizontal-small} - #{$button-border-size});
    min-width: $button-min-width;
    position: relative;
    :global(svg) {
      margin-left: $button-icon-spacing;
      font-size: $button-icon-size;
    }
    &:disabled {
      color: $button-disabled-color;
      border-color: $button-disabled-color;
    }
    z-index: 1;
  }

  .menu {
    position: absolute;
    top: 100%;
    list-style-type: none;
    margin: 0;
    padding: $popup-menu-padding 0;
    background-color: $popup-menu-background-color;
    border-radius: $popup-menu-border-radius;
    overflow: hidden;
    box-shadow: $popup-menu-shadow;
    z-index: 1;
    width: max-content;
    user-select: none;

    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }

    .separator {
      height: $popup-menu-separator-width;
      background-color: $popup-menu-separator-color;
      margin: $popup-menu-separator-spacing;
    }

    .item {
      @include type-style($type-popup-item);
      padding: $popup-menu-item-padding;
      display: flex;
      align-items: center;
      white-space: nowrap;
      cursor: default;

      &:focus {
        background-color: $popup-menu-item-selected-color;
        box-shadow: none;
      }

      &.danger {
        color: $accent-danger-color;
        font-weight: 500;
      }

      :global(svg) {
        font-size: $popup-menu-icon-size;
        margin-right: $popup-menu-icon-spacing;
      }
    }
  }

  .scrim {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>
