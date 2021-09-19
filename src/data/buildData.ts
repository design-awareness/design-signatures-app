/*
 * Copyright (c) 2021, Design Signatures Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

//@ts-ignore
export const BUILD_TIME: number = BUILDVAR__BUILD_TIME;
//@ts-ignore
export const VERSION: string = BUILDVAR__VERSION;
//@ts-ignore
export const BUILD_ENV: "dev" | "preview" | "prod" = BUILDVAR__BUILD_ENV;
//@ts-ignore
export const BRANCH: string = BUILDVAR__BRANCH;
//@ts-ignore
export const PULL_REQUEST: string | undefined = BUILDVAR__PULL_REQUEST;
//@ts-ignore
export const GIT_HEAD: string | undefined = BUILDVAR__GIT_HEAD;
//@ts-ignore
export const GIT_REPO: string = BUILDVAR__GIT_REPO;
