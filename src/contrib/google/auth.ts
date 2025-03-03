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

import { getErrorMessage } from "@/errors/errorHelpers";
import { forbidContext } from "@/utils/expectContext";
import chromeP from "webext-polyfill-kinda";

export async function ensureAuth(
  scopes: string[],
  { interactive = true } = {}
): Promise<string> {
  forbidContext(
    "contentScript",
    "The Google API is not available in content scripts"
  );

  if (!globalThis.gapi) {
    throw new TypeError("Google API not loaded");
  }

  try {
    // Does not work from browser.identity.getAuthToken. Returns null/undefined
    // See: https://github.com/pixiebrix/pixiebrix-extension/issues/3746
    const token = await chromeP.identity.getAuthToken({
      interactive,
      scopes,
    });
    if (token) {
      // https://bumbu.me/gapi-in-chrome-extension
      gapi.auth.setToken({ access_token: token } as any);
      return token;
    }
  } catch (error) {
    throw new Error(`Cannot get Chrome OAuth token: ${getErrorMessage(error)}`);
  }

  throw new Error(
    "Cannot get Chrome OAuth token: chrome.identity.getAuthToken did not return a token."
  );
}

class PermissionsError extends Error {
  override name = "PermissionsError";

  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function handleRejection(
  token: string,
  error: any
): Promise<Error> {
  console.debug("Google rejected request", { error });
  if (error.result == null) {
    return error;
  }

  const status = error.result?.error.code;

  if (status === 404) {
    return new PermissionsError(
      "Cannot locate the Google drive resource. Have you been granted access?",
      status
    );
  }

  if ([403, 401].includes(status)) {
    await browser.identity.removeCachedAuthToken({ token });
    console.debug(
      "Bad Google OAuth token. Removed the auth token from the cache so the user can re-authenticate"
    );
    return new PermissionsError(
      `Permission denied, re-authenticate with Google and try again. Details: ${getErrorMessage(
        error.result.error
      )}`,
      status
    );
  }

  return new Error(getErrorMessage(error.result.error));
}
