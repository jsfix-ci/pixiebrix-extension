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

import { Transformer, UnknownObject } from "@/types";
import { BlockArg, Schema } from "@/core";
import { BusinessError } from "@/errors";
import { getApplicationState } from "@/pageScript/protocol";

export class ApplicationStateReader extends Transformer {
  constructor() {
    super(
      "@pixiebrix/application-reader",
      "Read Application State (Experimental)",
      "Read application state (currently supports React 16+)"
    );
  }

  defaultOutputKey = "state";

  inputSchema: Schema = {
    type: "object",
    properties: {},
  };

  override outputSchema: Schema = {
    $schema: "https://json-schema.org/draft/2019-09/schema#",
    type: "object",
    additionalProperties: true,
  };

  override async isRootAware(): Promise<boolean> {
    return false;
  }

  override async isPure(): Promise<boolean> {
    return true;
  }

  async transform(_: BlockArg): Promise<UnknownObject> {
    // Need to run from the pageScript because the contentScript doesn't have access to the Javascript context
    const state = await getApplicationState();

    if (!state.react.hasFiber) {
      throw new BusinessError("React 16+ not found on the host application");
    }

    return state.react.data;
  }
}
