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

/* eslint-disable quotes -- `toMatchInlineSnapshot` is incompatible */
import { formatDate, formatDateTime, timeSince } from "./timeUtils";

test("formatDate", () => {
  // Accepts Date object
  expect(formatDate(new Date(2012, 8, 20, 3, 0, 0, 200))).toMatchInlineSnapshot(
    `"Sep 20, 2012"`
  );

  // Accepts Unix timestamp
  expect(formatDate(Number(new Date(2029, 5, 1)))).toMatchInlineSnapshot(
    `"Jun 1, 2029"`
  );

  // Accepts ISO string
  expect(formatDate(String(new Date(1999, 9, 9)))).toMatchInlineSnapshot(
    `"Oct 9, 1999"`
  );
});

test("formatDateTime", () => {
  // Accepts Date object
  expect(
    formatDateTime(new Date(2012, 8, 20, 13, 0, 0, 200))
  ).toMatchInlineSnapshot(`"Sep 20, 2012, 1:00:00 PM"`);

  // Accepts Unix timestamp
  expect(formatDateTime(Number(new Date(2029, 5, 1)))).toMatchInlineSnapshot(
    `"Jun 1, 2029, 12:00:00 AM"`
  );

  // Accepts ISO string
  expect(formatDateTime(String(new Date(1999, 9, 9)))).toMatchInlineSnapshot(
    `"Oct 9, 1999, 12:00:00 AM"`
  );
});

test("timeSince", () => {
  // Accepts Date object
  const date = new Date();
  date.setDate(date.getDate() - 30);
  expect(timeSince(date)).toMatchInlineSnapshot(`"1 month ago"`);

  // Accepts Unix timestamp
  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() - 7);
  expect(timeSince(Number(timestamp))).toMatchInlineSnapshot(`"7 days ago"`);

  // Accepts ISO string
  const isoString = new Date();
  isoString.setHours(isoString.getHours() - 2);
  expect(timeSince(String(isoString))).toMatchInlineSnapshot(`"2 hours ago"`);
});
