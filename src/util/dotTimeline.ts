/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { AsyncActivityData } from "design-awareness-data-types";
import { getDesignModel } from "../data/database";
import type { DesignModel, AsyncProject } from "../data/schema";
import { colorScheme } from "./colorScheme";

export let project: AsyncProject;

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
  let { entries } = project.entries;
  let rafHandle = -1;
  let numberOfActivities = activities.length;

  // node size calculations
  let contentWidth = 0;
  let contentHeight = 0;
  function updateSize() {
    // TODO: figure out how to calculate the height
    let height = numberOfActivities * ROW_HEIGHT + 2.9 * TIMELINE_PAD_V * 50;
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
    // console.log(reporting)
    // draw timeline
    ctx.resetTransform();
    ctx.scale(dpi, dpi);
    // ctx.fillStyle = "#" + "ff0000";
    // ctx.fill();
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, contentWidth, contentHeight);

    
    // draw rails
    {
      // ctx.lineWidth = 500;
      // ctx.fillStyle = theme.rail;
      // ctx.fillStyle = "#" + "00ff00";
      let y = TIMELINE_PAD_V + ROW_HEIGHT / 2 - RAIL_HEIGHT / 2 + 50;
      let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
      for (let i = 0; i < numberOfActivities; i++) {
        console.log("color: #" + activities[i]["color"][0] + "0D")
        ctx.fillStyle = "#" + activities[i].color[colorSchemeIdx];
        ctx.fill();
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(activities[i]["code"], 0, y + 45);
        ctx.fillStyle = "#" + activities[i].color[colorSchemeIdx] + "0D";
        ctx.fill();
        ctx.fillRect(ACTIVITY_LABEL_AREA_WIDTH, y, w, RAIL_HEIGHT*30);
        y += 3*ROW_HEIGHT;
        
      }
    }

    // dates
    // {
    //   let y = TIMELINE_PAD_V + ROW_HEIGHT / 2 - RAIL_HEIGHT / 2;
    //   let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
    //   for (let i = 0; i < project.entries.length; i++) {
    //     let rad2 = 10;
    //     ctx.beginPath();
    //     ctx.arc(y / 2, w / project.entries.length, rad2, 0, TAU);
    //     ctx.fillStyle = "#" + "00ff00";
    //     ctx.fill();
    //     y += 3*ROW_HEIGHT;
    //   }
    // }

    // draw dividing rails
    {
      ctx.fillStyle = theme.rail;
      // let height = numberOfActivities * ROW_HEIGHT + 2.9 * TIMELINE_PAD_V * 50;
      let section = 60;
      let spacer = 10.5;
      let timelineWidth = (section*numberOfActivities) + (spacer*numberOfActivities);
      console.log("activities: " + numberOfActivities);
      console.log("content height:" + contentHeight);
      console.log("section: " + section);
      
      // let railHeight = contentHeight - (numberOfActivities * 10)

      let y = TIMELINE_PAD_V + ROW_HEIGHT / 2 - RAIL_HEIGHT / 2 ;
      let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
      let x = ACTIVITY_LABEL_AREA_WIDTH;
      for (let i = 0; i < project.entries.length + 1; i++) {
        // ctx.fillStyle = "#" + "ffffff0D";
        // ctx.fill();
        // console.log(project.entries[i]["period"].toString());
        ctx.fillRect(x, 65, RAIL_HEIGHT, timelineWidth);
        // ctx.fillRect(ACTIVITY_LABEL_AREA_WIDTH, w, y, RAIL_HEIGHT);
        // let rad2 = 10;
        // ctx.beginPath();
        // ctx.arc(y / 2, w / project.entries.length, rad2, 0, TAU);
        
        // w += 3*ROW_HEIGHT;
        x += 100;
      }
    }

    // draw month bars
    {
      let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
      let section = w / project.entries.length;
      let spacer = 10.5;
      let timelineWidth = (section*numberOfActivities) + (spacer*numberOfActivities);
      
      let start = 0;
      // let end = 
      ctx.fillStyle = ctx.fillStyle = "#" + "80808080";
      let months = ["January", "Februrary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let y = TIMELINE_PAD_V + ROW_HEIGHT / 2 - RAIL_HEIGHT / 2;
      
      
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
          ctx.fillRect(position, y, width, height);
          ctx.fillStyle = "#000000";
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign="center"; 
          ctx.textBaseline = "middle";
          ctx.fillText(previousMonth, position+(width/2),y+(height/2));
          position += section*entriesInCurrentMonth;
          entriesInCurrentMonth = 1;
          previousMonth = currentMonth;
          // ctx.fillStyle = "#" + activities[i].color[colorSchemeIdx];
          // ctx.fill();
          // ctx.font = 'bold 15px sans-serif';
          // ctx.fillText(activities[i]["code"], 0, y + 45);
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

      // ctx.fillRect(ACTIVITY_LABEL_AREA_WIDTH, y, w, RAIL_HEIGHT*10);
      // ctx.fillRect(ACTIVITY_LABEL_AREA_WIDTH, y, section , RAIL_HEIGHT*10);
    }

    // {
    //   ctx.fillStyle = theme.rail;
    //   let y = TIMELINE_PAD_V + ROW_HEIGHT / 2 - RAIL_HEIGHT / 2;
    //   let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
    //   let x = ACTIVITY_LABEL_AREA_WIDTH;
    //   for (let i = 0; i < project.entries.length; i++) {
    //     // ctx.fillStyle = "#" + "ffffff0D";
    //     // ctx.fill();
    //     console.log(project.entries[i]["period"].toString());
    //     ctx.fillRect(x, 0, RAIL_HEIGHT, y*30);
    //     // ctx.fillRect(ACTIVITY_LABEL_AREA_WIDTH, w, y, RAIL_HEIGHT);
    //     // let rad2 = 10;
    //     // ctx.beginPath();
    //     // ctx.arc(y / 2, w / project.entries.length, rad2, 0, TAU);
        
    //     // w += 3*ROW_HEIGHT;
    //     x += 100;
    //   }
    // }

    // {
    //   for (let i = 0; i < numberOfActivities; i++) {
    //     ctx.fillStyle = activities[i]["color"][0];
    //     let y = TIMELINE_PAD_V + ROW_HEIGHT / 2 - RAIL_HEIGHT / 2;
    //     let w = contentWidth - ACTIVITY_LABEL_AREA_WIDTH;
    //   }
    // }


    // // draw bars & note dots
    // noteTouchTargets = [];
    // {
    //   for (let { data, priorDuration, duration, notes } of renderData) {
    //     let endX = toX(duration + priorDuration);

    //     // this session isn't visible - skip and try next
    //     if (endX < ACTIVITY_LABEL_AREA_WIDTH) continue;

    //     let y = TIMELINE_PAD_V + ROW_HEIGHT / 2 - BAR_HEIGHT / 2;
    //     for (let activity = 0; activity < numberOfActivities; activity++) {
    //       ctx.fillStyle = "#" + activities[activity].color[colorSchemeIdx];
    //       for (let [start, stop] of data[activity]) {
    //         let x2 = toX(stop + priorDuration);
    //         // this bar isn't visible - skip and try next
    //         if (x2 < ACTIVITY_LABEL_AREA_WIDTH) continue;
    //         let x = toX(start + priorDuration);
    //         let w = x2 - x;
    //         ctx.fillRect(x, y, w, BAR_HEIGHT);
    //         // this bar goes over the right edge - skip any future bars
    //         if (x2 > contentWidth + noteSize) break;
    //       }
    //       y += ROW_HEIGHT;
    //     }

    //     if (showNotes) {
    //       ctx.fillStyle = theme.noteColor;
    //       for (let note of notes) {
    //         let x = toX(note.time + priorDuration);
    //         if (x < 0) continue;
    //         if (x > contentWidth + noteSize) break;
    //         ctx.beginPath();
    //         ctx.arc(x, noteY, noteSize, 0, TAU);
    //         ctx.fill();
    //         noteTouchTargets.push({ x, y: noteY, note });
    //       }
    //     }

    //     // the next session won't be visible - done drawing bars!
    //     if (endX > contentWidth) break;
    //   }
    // }


    // TODO: Drawing goes here!
    // const image = document.querySelector(".dotgrid-body") as HTMLCanvasElement
    // html2canvas(image).then(ctx => {
    //   document.body.appendChild(ctx);
    //   // ctx.toDataURL("image/png");
    // });
    // var img = ctx.toDataURL("image/png");

    console.log("tortillas2");
    console.log(numberOfActivities);
    console.log("Activities: ");
    console.log(activities);
    console.log("Entries: ");
    console.log(project.entries);
    // console.log(addDays);
    // console.log(project.reportingPeriod);
    console.log(document.querySelector(".dotgrid-body")?.clientWidth);
    console.log(document.querySelector(".dotgrid-body"));

    // example - drawing a red dot in the middle :)
    // let rad2 = 10;
    // ctx.beginPath();
    // ctx.arc(contentWidth / 2, contentHeight / 2, rad2, 0, TAU);
    // ctx.fillStyle = "#" + "00ff00";
    // ctx.fill();
  }

  function scheduleDraw() {
    // console.log("tacos");
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
