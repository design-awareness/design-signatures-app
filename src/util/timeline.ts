/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { DesignModel, RealtimeSession, TimedNote } from "../data/schema";
import { colorScheme } from "./colorScheme";
import { expressiveDuration } from "./time";

interface RealtimeSessionLike {
  data: RealtimeSession["data"];
  duration: RealtimeSession["duration"];
}

interface RealtimeProjectLike {
  designModel: DesignModel;
  sessions: readonly RealtimeSessionLike[];
}

interface TimelineRendererDescriptor {
  project: RealtimeProjectLike;

  /**
   * display pixel scaling. Default is device pixel ratio.
   * Can be updated after initialization.
   */
  dpi?: number;

  /**
   * Whether user zoom/pannable
   */
  interactive?: boolean;

  /**
   * Callback for note user selection
   */
  selectNote?: (note: TimedNote) => void;

  /**
   * Whether to show notes in a bottom gutter. Default: true
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
const TIME_LABEL_STEP = [
  1 * 1000, // 1s
  5 * 1000, // 5s
  10 * 1000, // 10s
  30 * 1000, // 30s
  60 * 1000, // 60s
  2 * 60000, // 2m
  5 * 60000, // 5m
  10 * 60000, // 10m
  15 * 60000, // 15m
  30 * 60000, // 30m
  60 * 60000, // 1h
];
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
    interactive = true,
    dpi = window.devicePixelRatio ?? 1,
    selectNote,
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
  function updateHeight() {
    let height = numberOfActivities * ROW_HEIGHT + 2 * TIMELINE_PAD_V;
    if (showNotes) {
      height += SEPARATOR + NOTE_GUTTER_HEIGHT;
    }
    if (showTime) {
      height += SEPARATOR + TIME_GUTTER_HEIGHT;
    }
    contentHeight = height;
    node.style.height = height + "px";
  }
  updateHeight();

  let toPixelScalingFactor = 0;
  let displayScale = 1;
  let displayOffset = 0;
  // max display offset: (displayScale - 1) * (contentWidth - ACTIVITY_LABEL_AREA_WIDTH)
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

  // timeline calculations
  let totalDuration = project.sessions
    .map((s) => s.duration)
    .reduce((a, b) => a + b, 0);
  if (!totalDuration) {
    totalDuration = 1;
  }
  updateSize(width);

  let priorDuration = 0;
  let priorDurations: number[] = [];
  project.sessions.forEach((session) => {
    priorDurations.push(priorDuration);
    priorDuration += session.duration;
  });
  let renderData = project.sessions.map((session, i) => ({
    data: session.data,
    priorDuration: priorDurations[i],
  }));
  // remove initial 0 - leaves non-first session start times
  priorDurations.shift();

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
    toPixelScalingFactor =
      (contentWidth - ACTIVITY_LABEL_AREA_WIDTH) / totalDuration;
  }
  function toX(t: number) {
    return (
      t * toPixelScalingFactor * displayScale -
      displayOffset +
      ACTIVITY_LABEL_AREA_WIDTH
    );
  }

  function draw() {
    // draw timeline
    ctx.resetTransform();
    ctx.scale(dpi, dpi);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, contentWidth, contentHeight);

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

    // draw session markers
    {
      ctx.fillStyle = theme.sessionMarker;
      // let h = numberOfActivities * ROW_HEIGHT;
      for (let priorDuration of priorDurations) {
        // ctx.fillRect(toX(priorDuration), TIMELINE_PAD_V, SESSION_MARKER, h);
        ctx.fillRect(toX(priorDuration), 0, SESSION_MARKER, contentHeight);
      }
    }

    // draw bars
    {
      for (let { data, priorDuration } of renderData) {
        let y = TIMELINE_PAD_V + ROW_HEIGHT / 2 - BAR_HEIGHT / 2;
        for (let activity = 0; activity < numberOfActivities; activity++) {
          ctx.fillStyle = "#" + activities[activity].color[colorSchemeIdx];
          for (let [start, stop] of data[activity]) {
            let x = toX(start + priorDuration);
            let w = toX(stop + priorDuration) - x;
            ctx.fillRect(x, y, w, BAR_HEIGHT);
          }
          y += ROW_HEIGHT;
        }
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

    // TODO: draw note indicators

    // draw time labels
    if (showTime) {
      // get minimum time spacing in project time
      let minTimeStep = MIN_TIME_SPACING / toPixelScalingFactor / displayScale;
      // find least time step < minTimeDiff;
      let timeStep = 0;
      if (minTimeStep > 3600000) {
        let factor = Math.ceil(minTimeStep / 3600000);
        timeStep = factor * 3600000;
      } else {
        for (let step of TIME_LABEL_STEP) {
          if (step > minTimeStep) {
            timeStep = step;
            break;
          }
        }
      }

      let t = timeStep;
      let y = contentHeight - TIME_GUTTER_HEIGHT / 2;
      ctx.font = TIME_LABEL_FONT;
      ctx.fillStyle = theme.timeLabel;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      while (t < totalDuration) {
        ctx.fillText(expressiveDuration(t), toX(t), y);
        t += timeStep;
      }
    }

    // draw activity labels
    {
      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, ACTIVITY_LABEL_AREA_WIDTH, contentHeight);
      ctx.fillStyle = theme.separator;
      ctx.fillRect(
        ACTIVITY_LABEL_AREA_WIDTH - SEPARATOR,
        0,
        SEPARATOR,
        contentHeight
      );

      let x = ACTIVITY_LABEL_AREA_WIDTH / 2;
      let y = TIMELINE_PAD_V + ROW_HEIGHT / 2;
      ctx.font = ACTIVITY_LABEL_FONT;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (let activity of activities) {
        ctx.fillStyle = "#" + activity.color[colorSchemeIdx];
        ctx.fillText(activity.code, x, y);
        y += ROW_HEIGHT;
      }
    }
  }
  function scheduleDraw() {
    if (rafHandle !== -1) {
      cancelAnimationFrame(rafHandle);
    }
    rafHandle = requestAnimationFrame(draw);
  }

  // VIEWPORT MANAGEMENT & INTERACTION HANDLERS

  let panTouchX = -1;
  let panTouchY = -1;

  let touch1X = -1;
  let touch2X = -1;

  function elementPosition(t: Touch | MouseEvent | WheelEvent) {
    let rect = node.getBoundingClientRect();
    return {
      x: t.clientX - rect.left,
      y: t.clientY - rect.top,
    };
  }

  function clampScale() {
    displayScale = Math.max(displayScale, 1);
  }
  function clampOffset() {
    displayOffset = Math.max(
      0,
      Math.min(
        (displayScale - 1) * (contentWidth - ACTIVITY_LABEL_AREA_WIDTH),
        displayOffset
      )
    );
  }

  function onTouchStart(e: TouchEvent) {
    // don't even attempt to handle more than two touches
    if (e.targetTouches.length > 2) return;
    // console.log(e);

    if (e.changedTouches.length === 1 && e.targetTouches.length === 1) {
      // this is a single finger down as part of a pan
      let pos = elementPosition(e.changedTouches[0]);
      panTouchX = pos.x;
      panTouchY = pos.y;
    }

    if (e.targetTouches.length === 2) {
      touch1X = elementPosition(e.targetTouches[0]).x;
      touch2X = elementPosition(e.targetTouches[1]).x;
    }
  }
  function onTouchStop(e: TouchEvent) {
    if (e.targetTouches.length === 1) {
      let pos = elementPosition(e.targetTouches[0]);
      panTouchX = pos.x;
      panTouchY = pos.y;
    }
  }
  function onTouchMove(e: TouchEvent) {
    // don't even attempt to handle more than two touches
    if (e.targetTouches.length > 2) return;

    if (e.targetTouches.length === 1 && e.changedTouches.length === 1) {
      let touchPos = elementPosition(e.changedTouches[0]);
      let touchX = touchPos.x;
      let touchY = touchPos.y;
      let offsetX = panTouchX - touchX;
      let offsetY = panTouchY - touchY;
      // movement is mostly vertical - probably a vertical page scroll instead
      if (Math.abs(offsetY) > 4 * Math.abs(offsetX)) return;
      // cannot pan - zoomed all the way out
      if (displayOffset === 1) return;
      panTouchX = touchX;
      displayOffset += offsetX;
      clampOffset();
      scheduleDraw();
      e.preventDefault();
    }

    if (e.targetTouches.length === 2) {
      // try to match touches:
      let [touch1, touch2] = e.targetTouches;

      let touch1newX = elementPosition(touch1).x;
      let touch2newX = elementPosition(touch2).x;

      let scaleCenterPrior =
        (touch2X + touch1X) / 2 - ACTIVITY_LABEL_AREA_WIDTH;
      let scaleCenterNew =
        (touch2newX + touch1newX) / 2 - ACTIVITY_LABEL_AREA_WIDTH;

      let scalePrior = Math.max(1, Math.abs(touch2X - touch1X));
      let scaleNew = Math.max(1, Math.abs(touch2newX - touch1newX));

      touch1X = touch1newX;
      touch2X = touch2newX;

      let scaleChange = scaleNew / scalePrior;

      displayScale *= scaleChange;
      clampScale();

      displayOffset =
        (displayOffset + scaleCenterPrior) * scaleChange - scaleCenterNew;
      clampOffset();

      scheduleDraw();
      e.preventDefault();
    }
    // console.log(e);
  }
  function onWheel(_e: Event) {
    let e = _e as WheelEvent;
    if (e.metaKey || e.ctrlKey) {
      // scroll is a zoom!
      let scaleChange = Math.exp(e.deltaY * -0.01);
      displayScale *= scaleChange;
      clampScale();
      let scaleCenter = elementPosition(e).x - ACTIVITY_LABEL_AREA_WIDTH;

      displayOffset = (displayOffset + scaleCenter) * scaleChange - scaleCenter;
      clampOffset();
      scheduleDraw();
      e.preventDefault();
    } else {
      // zoomed out - no panning
      if (displayScale === 1) return;

      let dy = e.deltaY;
      let dx = e.deltaX;

      // one-axis mice: use shift to scroll timeline horizontally
      if (e.shiftKey) {
        dx = dy;
        // scroll is mostly vertical - probably intends to page scroll
      } else if (Math.abs(dy) > 4 * Math.abs(dx)) return;

      displayOffset += dx;
      clampOffset();
      scheduleDraw();
      e.preventDefault();
    }
  }
  function onMouseDown(e: MouseEvent) {
    panTouchX = elementPosition(e).x;
  }
  function onMouseUp(e: MouseEvent) {
    panTouchX = -1;
  }
  function onMouseMove(e: MouseEvent) {
    if (panTouchX !== -1) {
      let newX = elementPosition(e).x;
      let offset = panTouchX - newX;
      panTouchX = newX;
      displayOffset += offset;
      clampOffset();
      scheduleDraw();
    }
  }
  if (interactive) {
    node.addEventListener("touchstart", onTouchStart);
    node.addEventListener("touchend", onTouchStop);
    node.addEventListener("touchcancel", onTouchStop);
    node.addEventListener("touchmove", onTouchMove);
    node.addEventListener("wheel", onWheel);
    node.addEventListener("mousedown", onMouseDown);
    node.addEventListener("mouseup", onMouseUp);
    node.addEventListener("mousemove", onMouseMove);
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
    if (interactive) {
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchend", onTouchStop);
      node.removeEventListener("touchcancel", onTouchStop);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("scroll", onWheel);
      node.removeEventListener("mousedown", onMouseDown);
      node.removeEventListener("mouseup", onMouseUp);
      node.removeEventListener("mousemove", onMouseMove);
    }
  }

  return { update, destroy };
}
