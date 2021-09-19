/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { RealtimeSession } from "./schema";

/**
 * Check a RealtimeSession to determine if any data is corrupted (for example,
 * if a tracking session was interrupted and only partial timepairs were saved).
 * @param param0 session to check status of
 * @returns whether the session has timepairs that need repairing
 */
export function checkNeedsRepair({ data }: RealtimeSession) {
  return data.some((activityData) =>
    activityData.some(([_, end]) => end === -1)
  );
}

/**
 * Repair all timepairs in a RealtimeSession to restore monotonicity per
 * https://data.design-awareness.com/modules.html#realtimeactivityrecord
 * https://data.design-awareness.com/modules.html#realtimeactivitytimingpair
 *
 * Note: This does NOT save the session; callers will likely want to do so.
 * @param session session to repair
 */
export function repair(session: RealtimeSession) {
  let { duration, data } = session;
  session.data = data.map((activityData) =>
    activityData.map((activityEntry, i) => {
      if (activityEntry[1] !== -1) return activityEntry;
      if (i === activityData.length - 1) {
        return [activityEntry[0], duration];
      } else {
        return [activityEntry[0], activityData[i + 1][0] - 1];
      }
    })
  );
}
