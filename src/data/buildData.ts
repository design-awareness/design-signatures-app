/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const BUILD_TIME: number = BUILDVAR__BUILD_TIME;
export const VERSION: string = BUILDVAR__VERSION;
export const BUILD_ENV: "dev" | "preview" | "prod" = BUILDVAR__BUILD_ENV;
export const BRANCH: string | undefined = BUILDVAR__BRANCH;
export const PULL_REQUEST: string | undefined = BUILDVAR__PULL_REQUEST;
export const GIT_HEAD: string | undefined = BUILDVAR__GIT_HEAD;
export const GIT_REPO: string | undefined = BUILDVAR__GIT_REPO;
export const FEEDBACK_LINK: string | null = BUILDVAR__FEEDBACK_LINK;
