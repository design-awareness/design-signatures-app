/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { AsyncActivityData } from "design-awareness-data-types";
import type { DesignModel, RealtimeSession, TimedNote } from "../data/schema";
import { colorScheme } from "./colorScheme";

// TODO: update this to be like an async entry
interface AsyncEntryLike {
  data: AsyncActivityData[];
  period: string;
}

interface AsyncProjectLike {
  designModel: DesignModel;
  entries: readonly AsyncEntryLike[];
  // TODO: also need reporting period and periodAlignment
}

interface TimelineRendererDescriptor {
  project: AsyncProjectLike;

  /**
   * display pixel scaling. Default is device pixel ratio.
   * Can be updated after initialization.
   */
  dpi?: number;
  /**
   * Whether to show notes in the cells. Default: true
   */
  showNotes?: boolean;

  /**
   * Whether to show time in a bottom gutter. Default: true
   */
  showTime?: boolean;

  /**
   * If undefined, fill container. Otherwise, given in pixels.
   * Can be updated after initialization.
   */
  width?: number;
}

const TAU = 2 * Math.PI;

// TODO: figure out what constants you need!
const ROW_HEIGHT = 24;
const BAR_HEIGHT = 20;
const RAIL_HEIGHT = 2;
const SEPARATOR = 1;
const SESSION_MARKER = 2;
const NOTE_GUTTER_HEIGHT = 16;
const TIME_GUTTER_HEIGHT = 20;
const TIMELINE_PAD_V = 4;
/** Activity label area width, *including separator!* */
const ACTIVITY_LABEL_AREA_WIDTH = 52;
const MIN_TIME_SPACING = 60;

const TIME_LABEL_FONT = "500 12px Inter";
const ACTIVITY_LABEL_FONT = "600 14px Inter";

interface TimelineColors {
  background: string;
  rail: string;
  separator: string;
  sessionMarker: string;
  noteColor: string;
  timeLabel: string;
}

const LIGHT_THEME: TimelineColors = {
  background: "#ffffff", // alt-background
  rail: "#dadada",
  separator: "#999999", // text-ghost
  sessionMarker: "#dadada",
  noteColor: "#dbab0b", // accent-note
  timeLabel: "#757575", // text-secondary
};
const DARK_THEME: TimelineColors = {
  background: "#212121", // alt-background
  rail: "#757575",
  separator: "#999999", // text-ghost
  sessionMarker: "#757575",
  noteColor: "#c79611", // accent-note
  timeLabel: "#bdbdbd", // text-secondary
};

export default function timeline(
  node: HTMLCanvasElement,
  {
    project,
    dpi = window.devicePixelRatio ?? 1,
    showNotes = true,
    showTime = true,
    width,
  }: TimelineRendererDescriptor
) {
  if (!(node instanceof HTMLCanvasElement)) {
    throw new TypeError(
      "Timeline action can only be used on a <canvas> element."
    );
  }
  let ctxOrNull = node.getContext("2d");
  if (!ctxOrNull)
    throw new Error("Browser does not support Canvas rendering context");
  const ctx = ctxOrNull;

  let { activities } = project.designModel;
  let rafHandle = -1;
  let numberOfActivities = activities.length;

  // node size calculations
  let contentWidth = 0;
  let contentHeight = 0;
  // TODO: figure out how to calculate the height
  function updateHeight() {
    let height = numberOfActivities * ROW_HEIGHT + 2 * TIMELINE_PAD_V;
    // if (showNotes) {
    //   height += SEPARATOR + NOTE_GUTTER_HEIGHT;
    // }
    // if (showTime) {
    //   height += SEPARATOR + TIME_GUTTER_HEIGHT;
    // }
    contentHeight = height;
    node.style.height = height + "px";
  }
  updateHeight();

  let colorSchemeIdx = 0;
  let theme: TimelineColors = LIGHT_THEME;
  let colorThemeUnsubscriber = colorScheme.subscribe((value) => {
    colorSchemeIdx = value === "light" ? 0 : 1;
    theme = value === "light" ? LIGHT_THEME : DARK_THEME;
    scheduleDraw();
  });
  let observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    if (entries.length && width === undefined) {
      updateSize(undefined);
      scheduleDraw();
    }
  });
  observer.observe(node);

  updateSize(width);

  function updateSize(width: number | undefined) {
    if (width === undefined) {
      node.style.width = "100%";
      contentWidth = node.clientWidth;
    } else {
      node.style.width = width + "px";
      contentWidth = width;
    }
    node.width = contentWidth * dpi;
    node.height = contentHeight * dpi;
  }

  function draw() {
    // draw timeline
    ctx.resetTransform();
    ctx.scale(dpi, dpi);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, contentWidth, contentHeight);

    // TODO: Drawing goes here!
    project.entries[0].data;
    let rad = 20;
    ctx.beginPath();
    ctx.arc(150, 150, rad, 0, TAU);
    ctx.fillStyle = "#" + "ff0000";
    ctx.fill();

    // draw rails
    {
      ctx.fillStyle = theme.rail;
      let y = TIMELINE_PAD_V + ROW_HEIGHT / 2 - RAIL_HEIGHT / 2;
      let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
      for (let i = 0; i < numberOfActivities; i++) {
        ctx.fillRect(ACTIVITY_LABEL_AREA_WIDTH, y, w, RAIL_HEIGHT);
        y += ROW_HEIGHT;
      }
    }

    // draw separators
    if (showNotes || showTime) {
      let y = numberOfActivities * ROW_HEIGHT + 2 * TIMELINE_PAD_V;
      let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
      ctx.fillStyle = theme.separator;
      ctx.fillRect(ACTIVITY_LABEL_AREA_WIDTH, y, w, SEPARATOR);
      if (showNotes && showTime) {
        y += SEPARATOR + NOTE_GUTTER_HEIGHT;
        ctx.fillRect(ACTIVITY_LABEL_AREA_WIDTH, y, w, SEPARATOR);
      }
    }
  }
  function scheduleDraw() {
    if (rafHandle !== -1) {
      cancelAnimationFrame(rafHandle);
    }
    rafHandle = requestAnimationFrame(draw);
  }

  function update(newDescriptor: TimelineRendererDescriptor) {
    dpi = newDescriptor.dpi ?? window.devicePixelRatio ?? 1;
    width = newDescriptor.width;
    showNotes = newDescriptor.showNotes ?? showNotes;
    showTime = newDescriptor.showTime ?? showTime;
    updateHeight();
    updateSize(width);
    scheduleDraw();
  }
  function destroy() {
    if (rafHandle !== -1) {
      cancelAnimationFrame(rafHandle);
    }
    colorThemeUnsubscriber();
    observer.disconnect();
  }

  return { update, destroy };
}
