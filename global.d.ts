declare type DndEvent = import("svelte-dnd-action").DndEvent;
declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onconsider?: (
      event: CustomEvent<DndEvent> & { target: EventTarget & T }
    ) => void;
    onfinalize?: (
      event: CustomEvent<DndEvent> & { target: EventTarget & T }
    ) => void;
  }
}

declare const BUILDVAR__BUILD_TIME: number;
declare const BUILDVAR__VERSION: string;
declare const BUILDVAR__BUILD_ENV: "dev" | "preview" | "prod";
declare const BUILDVAR__BRANCH: string | undefined;
declare const BUILDVAR__PULL_REQUEST: string | undefined;
declare const BUILDVAR__GIT_HEAD: string | undefined;
declare const BUILDVAR__GIT_REPO: string | undefined;
declare const BUILDVAR__FEEDBACK_LINK: string | null;
