/*
 * Copyright (C) 2022 PixieBrix, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { formatDistanceToNowStrict } from "date-fns";

// Docs on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
// Try to avoid adding (many) more date formats to ensure consistency

/** @returns Mar 5, 2029 */
const shortDateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

/** @returns Mar 5, 2029, 1:05:40 PM   */
const shortDateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "medium",
});

/**
 * @param date Date object, ISO string, or unix timestamp in milliseconds
 * @returns "Sep 4, 1986"
 */
export function formatDate(date: Date | string | number): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return shortDateFormat.format(date);
}

/**
 * @param date Date object, ISO string, or unix timestamp in milliseconds
 * @returns "Sep 4, 1986, 1:00:00 PM"
 */
export function formatDateTime(date: Date | string | number): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return shortDateTimeFormat.format(date);
}

/**
 * @param date Date object, ISO string, or unix timestamp in milliseconds
 * @returns "3 days ago"
 */
export function timeSince(date: Date | string | number): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return formatDistanceToNowStrict(date, {
    addSuffix: true /* "ago" */,
  });
}
