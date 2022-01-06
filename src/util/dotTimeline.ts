/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { AsyncActivityData } from "design-awareness-data-types";
import { getDesignModel } from "../data/database";
import type { DesignModel, AsyncProject } from "../data/schema";
import { colorScheme } from "./colorScheme";

export let project: AsyncProject;

// Edgar's Magic Numbers!
const ROW_SIZE = 40; // vertical height of rows
const ROW_SPACING = 30; // vertical spacing between rows

// How far down the vertical dividers go
// I wanted to make an automatic forumula that would make
// perfect length dividers based on the row size and spacing,
// but I couldn't figure it out. Need to manually 
// tinker with this value a bit if you change size or spacing :/
const DIVIDER_ADJUSTMENT = 9; 

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
  dates: string;
}

const LIGHT_THEME: TimelineColors = {
  background: "#ffffff", // alt-background
  rail: "#dadada",
  separator: "#999999", // text-ghost
  sessionMarker: "#dadada",
  noteColor: "#dbab0b", // accent-note
  timeLabel: "#757575", // text-secondary
  dates: "#000000"
};
const DARK_THEME: TimelineColors = {
  background: "#212121", // alt-background
  rail: "#757575",
  separator: "#999999", // text-ghost
  sessionMarker: "#757575",
  noteColor: "#c79611", // accent-note
  timeLabel: "#bdbdbd", // text-secondary
  dates: "ffffff"
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
  let { entries } = project.entries;
  let rafHandle = -1;
  let numberOfActivities = activities.length;

  // node size calculations
  let contentWidth = 0;
  let contentHeight = 0;
  function updateSize() {
    // TODO: figure out how to calculate the height
    let height = numberOfActivities * ROW_SPACING + 2.9 * TIMELINE_PAD_V * 50;
    // if (showNotes) {
    //   height += SEPARATOR + NOTE_GUTTER_HEIGHT;
    // }
    // if (showTime) {
    //   height += SEPARATOR + TIME_GUTTER_HEIGHT;
    // }

    // TODO: calculate the width
    // let width = 1000;
    let width = project.entries.length * 100 + 55;

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
    ctx.resetTransform();
    ctx.scale(dpi, dpi);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, contentWidth, contentHeight);

    
    // draws activity labels and rows
    {
      let y = TIMELINE_PAD_V + ROW_SPACING / 2 - RAIL_HEIGHT / 2 + 50;
      let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;

      for (let i = 0; i < numberOfActivities; i++) {
        console.log("color: #" + activities[i]["color"][0] + "0D")
        ctx.fillStyle = "#" + activities[i].color[colorSchemeIdx];
        ctx.fill();
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(activities[i]["code"], 3, y+(RAIL_HEIGHT*ROW_SIZE/2));
        ctx.fillStyle = "#" + activities[i].color[colorSchemeIdx] + "0D";
        ctx.fill();
        ctx.fillRect(ACTIVITY_LABEL_AREA_WIDTH, y, w, RAIL_HEIGHT*ROW_SIZE);

        y += 3*ROW_SPACING;
      }
    } 

    // Draws dots!
    {
      let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
      let section = w / project.entries.length;
      // let max_radius = (RAIL_HEIGHT * ROW_SIZE) / 2;
      for (let i = 0; i < project.entries.length; i++) {
        let y = TIMELINE_PAD_V + ROW_SPACING / 2 - RAIL_HEIGHT / 2 + 50;
        for (let k = 0; k < project.entries[i].data.length; k++) {
          ctx.beginPath();
          ctx.arc(section+(section*i), y+(RAIL_HEIGHT*ROW_SIZE/2), project.entries[i].data[k].value/15, 0, TAU);
          ctx.fillStyle = "#" + activities[k].color[colorSchemeIdx];
          ctx.fill();
          y += 3*ROW_SPACING;
        }
      }
    }


    // vertical dividing lines
    {
      ctx.fillStyle = theme.rail;
      let section = ROW_SIZE*2;
      let timelineWidth = (section*numberOfActivities) + (DIVIDER_ADJUSTMENT*numberOfActivities);
      let x = ACTIVITY_LABEL_AREA_WIDTH;
      for (let i = 0; i < project.entries.length + 1; i++) {
        ctx.fillRect(x, 65, RAIL_HEIGHT, timelineWidth);
        x += 100;
      }
    }

    // draw dates
    {
      let x = ACTIVITY_LABEL_AREA_WIDTH;
      for (let i = 0; i < project.entries.length; i++) {
        ctx.fillStyle = theme.timeLabel;
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText(project.entries[i].period.getUTCDate().toString(), x+50,50+(RAIL_HEIGHT/2));
        x += 100;
      }
    }

    // draw month bars
    {
      let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
      let section = w / project.entries.length;

      ctx.fillStyle = ctx.fillStyle = "#" + "80808080";
      let y = TIMELINE_PAD_V + ROW_SPACING / 2 - RAIL_HEIGHT / 2;
      
      let entriesInCurrentMonth = 0;
      let currentMonth = "";
      let previousMonth = "";
      let position = ACTIVITY_LABEL_AREA_WIDTH;
      for (let i=0; i < project.entries.length; i++) {
        console.log("position: " + position);
        currentMonth = project.entries[i].period.toDateString().substring(4,7);
        if (currentMonth == previousMonth || previousMonth == "") {
          entriesInCurrentMonth += 1;
          previousMonth = currentMonth;
        } else { // Moved on to new 
          let width = section*entriesInCurrentMonth-5;
          let height = RAIL_HEIGHT*10;
          ctx.fillStyle = "#" + "80808080";
          ctx.fillRect(position, y, width, height);
          ctx.fillStyle = "#000000";
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign="center"; 
          ctx.textBaseline = "middle";
          ctx.fillText(previousMonth, position+(width/2),y+(height/2));
          position += section*entriesInCurrentMonth;
          entriesInCurrentMonth = 1;
          previousMonth = currentMonth;
        }
        
        // Makes sure to plot the last month
        if ((i+1) == project.entries.length) {
          ctx.fillStyle = "#" + "80808080";
          let width = section*entriesInCurrentMonth-5;
          let height = RAIL_HEIGHT*10;
          ctx.fillRect(position, y, width, height);
          ctx.fillStyle = "#000000";
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign="center"; 
          ctx.textBaseline = "middle";
          ctx.fillText(currentMonth, position+(width/2),y+(height/2));
        }

        console.log(project.entries[i].period.toDateString().substring(4,7));
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
