/*
 * Copyright (c) 2021-2023, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { AsyncActivityData } from "design-awareness-data-types";
import type { DesignModel, AsyncProject } from "../data/schema";
import { colorScheme } from "./colorScheme";
import { MONTH_NAME } from "./date";
import { sortBy } from "./sort";

export let project: AsyncProject;

interface AsyncEntryLike {
  data: readonly AsyncActivityData[];
  note?: string;
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

/** Activity label area width */
const ACTIVITY_LABEL_AREA_WIDTH = 52;
const LABEL_PADDING = 6;

const DOT_SIZE = 20;
const CELL_PADDING = 2;
const ENTRY_DIVIDER_WIDTH = 2;
const ENTRY_DIVIDER_OVERHANG = 2;
const CELL_SIZE = 2 * (DOT_SIZE + CELL_PADDING);
const ROW_SPACING = 4; // vertical spacing between rows

const FULL_ROW_HEIGHT = CELL_SIZE + ROW_SPACING;
const FULL_ENTRY_WIDTH = (DOT_SIZE + CELL_PADDING) * 2 + ENTRY_DIVIDER_WIDTH;

const DASH_HEIGHT = 2;
const DASH_WIDTH = 6;

const MONTH_BAR_HEIGHT = 24;
const DATE_AREA_HEIGHT = 24;

const TIME_LABEL_FONT = "500 14px Inter";
const MONTH_LABEL_FONT = "600 14px Inter";
const ACTIVITY_LABEL_FONT = "600 14px Inter";

const PAD_EDGE = 8;

interface TimelineColors {
  background: string;
  rail: string;
  separator: string;
  dash: string;
  sessionMarker: string;
  noteColor: string;
  timeLabel: string;
  monthBar: string;
}

const LIGHT_THEME: TimelineColors = {
  background: "#ffffff", // alt-background
  rail: "#dadada",
  separator: "#999999", // text-ghost
  dash: "#999999", // text-ghost
  sessionMarker: "#dadada",
  noteColor: "#dbab0b", // accent-note
  timeLabel: "#757575", // text-secondary
  monthBar: "#eaeaea",
};
const DARK_THEME: TimelineColors = {
  background: "#212121", // alt-background
  rail: "#757575",
  separator: "#999999", // text-ghost
  dash: "#999999", // text-ghost
  sessionMarker: "#757575",
  noteColor: "#c79611", // accent-note
  timeLabel: "#bdbdbd", // text-secondary
  monthBar: "#333333",
};

const maxFn = (a: number, b: number) => Math.max(a, b);

export default function dotTimeline(
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
  let entries = sortBy("period", project.entries);
  let maxDuration = entries
    .map(({ data }) => data.map(({ value }) => value).reduce(maxFn, 0))
    .reduce(maxFn, 0);

  let rafHandle = -1;
  let numberOfActivities = activities.length;

  // node size calculations
  let contentWidth = 0;
  let contentHeight = 0;
  function updateSize() {
    let height =
      (showDates ? MONTH_BAR_HEIGHT + DATE_AREA_HEIGHT : 0) +
      // timeline
      (numberOfActivities - 1) * ROW_SPACING +
      numberOfActivities * (DOT_SIZE + CELL_PADDING) * 2 +
      2 * ENTRY_DIVIDER_OVERHANG;

    let width =
      // activity label area
      ACTIVITY_LABEL_AREA_WIDTH +
      // entries
      entries.length * (DOT_SIZE + CELL_PADDING) * 2 +
      // dividers
      (entries.length + 1) * ENTRY_DIVIDER_WIDTH;

    contentHeight = height;
    height += PAD_EDGE * 2;
    node.style.height = height + "px";
    node.height = height * dpi;

    contentWidth = width;
    width += PAD_EDGE * 2;
    node.style.width = width + "px";
    node.width = width * dpi;
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
    let yTop = showDates ? MONTH_BAR_HEIGHT + DATE_AREA_HEIGHT : 0;
    ctx.resetTransform();
    ctx.scale(dpi, dpi);
    ctx.fillStyle = theme.background;
    ctx.fillRect(
      0,
      0,
      contentWidth + PAD_EDGE * 2,
      contentHeight + PAD_EDGE * 2
    );
    ctx.translate(PAD_EDGE, PAD_EDGE);

    function drawNoteTriangle(x: number, y: number) {
      ctx.fillStyle = theme.noteColor;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 6, y);
      ctx.lineTo(x, y + 6);
      ctx.fill();
    }

    // draws activity labels
    {
      let y = yTop + ENTRY_DIVIDER_OVERHANG;
      ctx.textBaseline = "middle";
      ctx.textAlign = "right";

      for (let activity of activities) {
        ctx.fillStyle = "#" + activity.color[colorSchemeIdx];
        ctx.font = ACTIVITY_LABEL_FONT;
        ctx.fillText(
          activity.code,
          ACTIVITY_LABEL_AREA_WIDTH - LABEL_PADDING,
          y + DOT_SIZE + CELL_PADDING
        );

        y += FULL_ROW_HEIGHT;
      }
    }

    // Draws dots!
    {
      let x = ACTIVITY_LABEL_AREA_WIDTH + ENTRY_DIVIDER_WIDTH;
      for (let entry of entries) {
        let y = yTop + ENTRY_DIVIDER_OVERHANG;
        for (let activity = 0; activity < entry.data.length; activity++) {
          if (entry.data[activity].value > 0) {
            // draw background
            ctx.fillStyle =
              "#" + activities[activity].color[colorSchemeIdx] + "0D";
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            // draw dot
            ctx.beginPath();
            ctx.arc(
              x + CELL_SIZE / 2,
              y + CELL_SIZE / 2,
              Math.sqrt(entry.data[activity].value / maxDuration) * DOT_SIZE,
              0,
              TAU
            );
            ctx.fillStyle = "#" + activities[activity].color[colorSchemeIdx];
            ctx.fill();
          } else {
            // draw dash
            ctx.fillStyle = theme.dash;
            ctx.fillRect(
              x + (CELL_SIZE - DASH_WIDTH) / 2,
              y + (CELL_SIZE - DASH_HEIGHT) / 2,
              DASH_WIDTH,
              DASH_HEIGHT
            );
          }
          if (showNotes && entry.data[activity].note) {
            drawNoteTriangle(x + CELL_SIZE, y);
          }
          y += FULL_ROW_HEIGHT;
        }
        x += FULL_ENTRY_WIDTH;
      }
    }
    // vertical dividing lines
    {
      ctx.fillStyle = theme.rail;
      let x = ACTIVITY_LABEL_AREA_WIDTH;
      let y = yTop;
      let h =
        FULL_ROW_HEIGHT * numberOfActivities -
        ROW_SPACING +
        2 * ENTRY_DIVIDER_OVERHANG;

      for (let i = 0; i < entries.length + 1; i++) {
        ctx.fillRect(x, y, ENTRY_DIVIDER_WIDTH, h);
        x += FULL_ENTRY_WIDTH;
      }
    }

    // draw dates
    if (showDates) {
      let x =
        ACTIVITY_LABEL_AREA_WIDTH +
        ENTRY_DIVIDER_WIDTH +
        CELL_PADDING +
        DOT_SIZE;
      let y = MONTH_BAR_HEIGHT + DATE_AREA_HEIGHT / 2;
      for (let i = 0; i < entries.length; i++) {
        ctx.fillStyle = theme.timeLabel;
        ctx.font = TIME_LABEL_FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(entries[i].period.getUTCDate().toString(), x, y);
        if (showNotes && entries[i].note) {
          drawNoteTriangle(x + DOT_SIZE + CELL_PADDING, MONTH_BAR_HEIGHT);
        }
        x += FULL_ENTRY_WIDTH;
      }
    }

    // draw month bars
    // FIXME: refactor to fix duplication from fencepost pull-out
    if (showDates) {
      let entriesInCurrentMonth = 0;
      let currentMonth = "";
      let monthStr = "";
      let previousMonth = "";
      let x = ACTIVITY_LABEL_AREA_WIDTH + ENTRY_DIVIDER_WIDTH;
      for (let i = 0; i < entries.length; i++) {
        currentMonth = entries[i].period.toISOString().substring(0, 7);
        if (currentMonth == previousMonth || previousMonth == "") {
          entriesInCurrentMonth += 1;
          previousMonth = currentMonth;
        } else {
          // Moved on to new
          let width =
            FULL_ENTRY_WIDTH * entriesInCurrentMonth - ENTRY_DIVIDER_WIDTH;
          ctx.fillStyle = theme.monthBar;
          ctx.fillRect(x, 0, width, MONTH_BAR_HEIGHT);
          ctx.fillStyle = theme.timeLabel;
          ctx.font = MONTH_LABEL_FONT;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(monthStr, x + width / 2, MONTH_BAR_HEIGHT / 2);
          x += FULL_ENTRY_WIDTH * entriesInCurrentMonth;
          entriesInCurrentMonth = 1;
          previousMonth = currentMonth;
        }
        monthStr = MONTH_NAME[entries[i].period.getUTCMonth()];
      }
      let width =
        FULL_ENTRY_WIDTH * entriesInCurrentMonth - ENTRY_DIVIDER_WIDTH;
      ctx.fillStyle = theme.monthBar;
      ctx.fillRect(x, 0, width, MONTH_BAR_HEIGHT);
      ctx.fillStyle = theme.timeLabel;
      ctx.font = MONTH_LABEL_FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(monthStr, x + width / 2, MONTH_BAR_HEIGHT / 2);
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
