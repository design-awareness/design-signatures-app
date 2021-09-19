/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export function download(filename: string, type: string, data: string) {
  let file = new Blob([data], { type });
  downloadBlob(filename, file);
}

export function downloadBlob(filename: string, blob: Blob) {
  let url = URL.createObjectURL(blob);
  let link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
}
