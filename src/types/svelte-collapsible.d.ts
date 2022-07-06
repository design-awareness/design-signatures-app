declare module "svelte-collapsible" {
  import { SvelteComponentTyped } from "svelte";

  interface AccordionProps {
    key?: string;
  }

  interface AccordionItemProps {
    key?: string;
    easing?: string;
    duration?: number;
  }
  export class Accordion extends SvelteComponentTyped<AccordionProps> {}
  export class AccordionItem extends SvelteComponentTyped<AccordionItemProps> {}
}
