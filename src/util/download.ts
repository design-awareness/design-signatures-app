/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export default function download(filename: string, type: string, data: string) {
  let file = new Blob([data], { type });
  let url = URL.createObjectURL(file);
  let link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
}
