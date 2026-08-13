declare module "svelte-collapsible" {
  import type { SvelteComponent } from "svelte";

  interface AccordionProps {
    key?: string;
  }
  interface AccordionSlots {
    default: {};
  }

  interface AccordionItemProps {
    key?: string;
    easing?: string;
    duration?: number;
  }
  interface AccordionItemSlots {
    header: {};
    body: {};
    default: {};
  }

  export class Accordion extends SvelteComponent<
    AccordionProps,
    any,
    AccordionSlots
  > {}
  export class AccordionItem extends SvelteComponent<
    AccordionItemProps,
    any,
    AccordionItemSlots
  > {}
}
