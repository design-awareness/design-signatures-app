/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * Parameters used to create a <canvas> action
 */
export interface CanvasDescriptor {
  /**
   * Function used to draw content onto a canvas.
   * @param ctx the canvas's drawing context
   * @param w width of the canvas
   * @param h height of the canvas
   */
  draw(ctx: CanvasRenderingContext2D, w: number, h: number): void;

  /**
   * Called once, after the canvas is mounted, and before the first call
   * to draw().
   * @param ctx the canvas's drawing context
   * @param w width of the canvas
   * @param h height of the canvas
   */
  init?(ctx: CanvasRenderingContext2D, w: number, h: number): void;

  /**
   * Whether to automatically call draw every animation frame.
   * @default false
   */
  animate?: boolean;

  /**
   * Whether to clear the canvas (i.e., set all pixels to transparent)
   * before every call to draw.
   * Otherwise, drawing will occur on top of existing canvas content.
   * The canvas's transform will be reset before draw() is called
   * regardless of this setting.
   * @default false
   */
  clear?: boolean;
}

type CanvasAction = (node: HTMLCanvasElement) => { destroy: () => void };
type CanvasDrawInvoker = () => void;

/**
 * Creates an action to `use:` on a <canvas> element.
 * @param descriptor Provides the drawing code for the canvas object. For
 * convenience, clients can pass a function that returns a descriptor. This
 * allows for closing over variables to avoid scope pollution.
 * @returns a canvas drawing action to `use:` on a <canvas> element, and a
 * draw invoker that can be used to trigger a redraw (which, by default,
 * only happens when the size of the <canvas> changes.)
 */
export function makeCanvasAction(
  descriptor: CanvasDescriptor | (() => CanvasDescriptor)
): [CanvasAction, CanvasDrawInvoker] {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let dpr = window.devicePixelRatio ?? 1;
  let width = 0;
  let height = 0;
  let ready = false;
  let animationHandle = -1;

  // for convenience, clients can pass in a function that returns a descriptor.
  // if that was the case, resolve that right away
  if (typeof descriptor === "function") {
    descriptor = descriptor();
  }
  let { draw: clientDraw, init, animate = false, clear = false } = descriptor;

  function draw() {
    if (!ready) return;
    if (animate) {
      cancelAnimationFrame(animationHandle);
    }

    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    if (clear) {
      ctx.clearRect(0, 0, width, height);
    }

    clientDraw(ctx, width, height);

    if (animate) {
      animationHandle = requestAnimationFrame(draw);
    }
  }

  function resize(entries: ResizeObserverEntry[]) {
    if (entries.length) {
      let entry = entries[0];
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      cancelAnimationFrame(animationHandle);
      animationHandle = requestAnimationFrame(draw);
    }
  }
  let observer = new ResizeObserver(resize);

  function action(node: HTMLCanvasElement) {
    if (!(node instanceof HTMLCanvasElement)) {
      throw new TypeError(
        "Canvas action can only be used on a <canvas> element."
      );
    }
    width = node.clientWidth;
    height = node.clientHeight;
    node.width = width * dpr;
    node.height = height * dpr;
    observer.observe(node);

    canvas = node;
    let ctxOrNull = node.getContext("2d");
    if (!ctxOrNull)
      throw new Error("Browser does not support Canvas rendering context");
    ctx = ctxOrNull;

    ctx.scale(dpr, dpr);
    init?.(ctx, width, height);

    ready = true;
    // starts animation loop if necessary:
    draw();

    return {
      destroy() {
        if (animate) {
          cancelAnimationFrame(animationHandle);
        }
        observer.disconnect();
      },
    };
  }

  return [action, draw];
}
