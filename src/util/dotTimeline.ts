/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { AsyncActivityData } from "design-awareness-data-types";
import type { DesignModel, AsyncProject } from "../data/schema";
import { colorScheme } from "./colorScheme";

// TODO: update this to be like an async entry
interface AsyncEntryLike {
  data: readonly AsyncActivityData[];
  period: Date;
}

export interface AsyncProjectLike {
  designModel: DesignModel;
  entries: readonly AsyncEntryLike[];
  reportingPeriod: AsyncProject["reportingPeriod"];
  periodAlignment: AsyncProject["periodAlignment"];
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
   * Whether to show dates along the top of the timeline. Default: true
   */
  showDates?: boolean;

  /**
   * Whether to hide days that have no data. Default: false
   */
  hideEmptyDays?: boolean;
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
    showDates = true,
    hideEmptyDays = false,
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
  function updateSize() {
    // TODO: figure out how to calculate the height
    let height = numberOfActivities * ROW_HEIGHT + 2 * TIMELINE_PAD_V;
    // if (showNotes) {
    //   height += SEPARATOR + NOTE_GUTTER_HEIGHT;
    // }
    // if (showTime) {
    //   height += SEPARATOR + TIME_GUTTER_HEIGHT;
    // }

    // TODO: calculate the width
    let width = 600;

    contentHeight = height;
    node.style.height = height + "px";
    node.height = contentHeight * dpi;

    contentWidth = width;
    node.style.width = width + "px";
    node.width = contentWidth * dpi;
  }
  updateSize();

  let colorSchemeIdx = 0;
  let theme: TimelineColors = LIGHT_THEME;
  let colorThemeUnsubscriber = colorScheme.subscribe((value) => {
    colorSchemeIdx = value === "light" ? 0 : 1;
    theme = value === "light" ? LIGHT_THEME : DARK_THEME;
    scheduleDraw();
  });

  function draw() {
    // draw timeline
    ctx.resetTransform();
    ctx.scale(dpi, dpi);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, contentWidth, contentHeight);

    // TODO: Drawing goes here!

    // example - drawing a red dot in the middle :)
    let rad = 20;
    ctx.beginPath();
    ctx.arc(contentWidth / 2, contentHeight / 2, rad, 0, TAU);
    ctx.fillStyle = "#" + "ff0000";
    ctx.fill();
  }

  function scheduleDraw() {
    if (rafHandle !== -1) {
      cancelAnimationFrame(rafHandle);
    }
    rafHandle = requestAnimationFrame(draw);
  }

  function update(newDescriptor: TimelineRendererDescriptor) {
    dpi = newDescriptor.dpi ?? window.devicePixelRatio ?? 1;
    showNotes = newDescriptor.showNotes ?? showNotes;
    showDates = newDescriptor.showDates ?? showDates;
    hideEmptyDays = newDescriptor.hideEmptyDays ?? hideEmptyDays;
    updateSize();
    scheduleDraw();
  }
  function destroy() {
    if (rafHandle !== -1) {
      cancelAnimationFrame(rafHandle);
    }
    colorThemeUnsubscriber();
  }

  return { update, destroy };
}
