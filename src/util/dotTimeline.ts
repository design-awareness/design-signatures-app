/*
 * Copyright (c) 2021-2022, Design Awareness Contributors.
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

const DOT_SIZE = 24;
const CELL_PADDING = 4;
const ENTRY_DIVIDER_WIDTH = 2;
const ENTRY_DIVIDER_OVERHANG = 2;

const CELL_SIZE = 2 * (DOT_SIZE + CELL_PADDING);

const MONTH_BAR_HEIGHT = 24;
const DATE_AREA_HEIGHT = 24;

// Edgar's Magic Numbers!
// const ROW_SIZE = DOT_SIZE + CELL_PADDING * 2; // vertical height of rows
const ROW_SPACING = 8; // vertical spacing between rows

// How far down the vertical dividers go
// I wanted to make an automatic forumula that would make
// perfect length dividers based on the row size and spacing,
// but I couldn't figure it out. Need to manually
// tinker with this value a bit if you change size or spacing :/
// const DIVIDER_ADJUSTMENT = 9;

const TIME_LABEL_FONT = "500 14px Inter";
const MONTH_LABEL_FONT = "600 14px Inter";
const ACTIVITY_LABEL_FONT = "600 14px Inter";

const PAD_EDGE = 12;

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
    // TODO: figure out how to calculate the height
    let height =
      MONTH_BAR_HEIGHT +
      DATE_AREA_HEIGHT +
      // timeline
      (numberOfActivities - 1) * ROW_SPACING +
      numberOfActivities * (DOT_SIZE + CELL_PADDING) * 2 +
      2 * ENTRY_DIVIDER_OVERHANG;

    // if (showNotes) {
    //   height += SEPARATOR + NOTE_GUTTER_HEIGHT;
    // }
    // if (showTime) {
    //   height += SEPARATOR + TIME_GUTTER_HEIGHT;
    // }

    // TODO: calculate the width
    // let width = 1000;
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

    // draws activity labels and rows
    const fullRowHeight = CELL_SIZE + ROW_SPACING;
    const fullEntryWidth = (DOT_SIZE + CELL_PADDING) * 2 + ENTRY_DIVIDER_WIDTH;
    {
      let y = MONTH_BAR_HEIGHT + DATE_AREA_HEIGHT + ENTRY_DIVIDER_OVERHANG;
      const w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";

      for (let activity of activities) {
        ctx.fillStyle = "#" + activity.color[colorSchemeIdx];
        ctx.font = ACTIVITY_LABEL_FONT;
        ctx.fillText(activity.code, 3, y + DOT_SIZE + CELL_PADDING);

        y += fullRowHeight;
      }
    }

    // Draws dots!
    {
      let x = ACTIVITY_LABEL_AREA_WIDTH + ENTRY_DIVIDER_WIDTH;
      // let max_radius = (RAIL_HEIGHT * ROW_SIZE) / 2;
      for (let entry of entries) {
        let y = MONTH_BAR_HEIGHT + DATE_AREA_HEIGHT + ENTRY_DIVIDER_OVERHANG;
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
            const D_HEIGHT = 2;
            const D_WIDTH = 6;
            ctx.fillRect(
              x + (CELL_SIZE - D_WIDTH) / 2,
              y + (CELL_SIZE - D_HEIGHT) / 2,
              D_WIDTH,
              D_HEIGHT
            );
          }
          y += fullRowHeight;
        }
        x += fullEntryWidth;
      }
    }
    // vertical dividing lines
    {
      ctx.fillStyle = theme.rail;
      let x = ACTIVITY_LABEL_AREA_WIDTH;
      let y = MONTH_BAR_HEIGHT + DATE_AREA_HEIGHT;
      let h =
        fullRowHeight * numberOfActivities -
        ROW_SPACING +
        2 * ENTRY_DIVIDER_OVERHANG;

      for (let i = 0; i < entries.length + 1; i++) {
        ctx.fillRect(x, y, ENTRY_DIVIDER_WIDTH, h);
        x += fullEntryWidth;
      }
    }

    // draw dates
    {
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
        x += fullEntryWidth;
      }
    }

    // draw month bars
    {
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
            fullEntryWidth * entriesInCurrentMonth - ENTRY_DIVIDER_WIDTH;
          ctx.fillStyle = theme.monthBar;
          ctx.fillRect(x, 0, width, MONTH_BAR_HEIGHT);
          ctx.fillStyle = theme.timeLabel;
          ctx.font = MONTH_LABEL_FONT;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(monthStr, x + width / 2, MONTH_BAR_HEIGHT / 2);
          x += fullEntryWidth * entriesInCurrentMonth;
          entriesInCurrentMonth = 1;
          previousMonth = currentMonth;
        }
        monthStr = MONTH_NAME[entries[i].period.getUTCMonth()];
      }
      let width = fullEntryWidth * entriesInCurrentMonth - ENTRY_DIVIDER_WIDTH;
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
