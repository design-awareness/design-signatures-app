/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import CONFIG from "./config";

const MAX_RECENT_PROJECTS = 8;

export function getRecentProjects(): Promise<string[]> {
  return CONFIG.getRecentProjects();
}

export async function pushRecentProject(pid: string): Promise<void> {
  let current = await getRecentProjects();
  let newRPs = current.filter((id) => id !== pid);
  newRPs.unshift(pid);
  if (newRPs.length > MAX_RECENT_PROJECTS) {
    newRPs.pop();
  }
  await CONFIG.setRecentProjects(newRPs);
}

export async function removeRecentProject(pid: string): Promise<void> {
  await CONFIG.setRecentProjects(
    (await getRecentProjects()).filter((id) => id !== pid)
  );
}
