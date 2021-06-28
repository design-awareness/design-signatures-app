import type { SvelteComponent } from "svelte";

export type ComponentConstructor<C extends SvelteComponent> = new (
  ...args: any[]
) => C;
