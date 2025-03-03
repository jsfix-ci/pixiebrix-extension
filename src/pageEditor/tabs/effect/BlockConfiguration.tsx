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

import React, { useMemo, useRef } from "react";
import { RegistryId } from "@/core";
import { getIn, useFormikContext } from "formik";
import useBlockOptions from "@/hooks/useBlockOptions";
import { Card } from "react-bootstrap";
import SchemaFieldContext from "@/components/fields/schemaFields/SchemaFieldContext";
import devtoolFieldOverrides from "@/pageEditor/fields/devtoolFieldOverrides";
import Loader from "@/components/Loader";
import ConnectedFieldTemplate from "@/components/form/ConnectedFieldTemplate";
import { joinName } from "@/utils";
import { useAsyncState } from "@/hooks/common";
import SelectWidget, { Option } from "@/components/form/widgets/SelectWidget";
import { partial } from "lodash";
import { BlockWindow } from "@/blocks/types";
import AdvancedLinks, {
  DEFAULT_WINDOW_VALUE,
} from "@/pageEditor/tabs/effect/AdvancedLinks";
import { SchemaFieldProps } from "@/components/fields/schemaFields/propTypes";
import SchemaField from "@/components/fields/schemaFields/SchemaField";
import FieldSection from "@/pageEditor/fields/FieldSection";
import getType from "@/runtime/getType";
import { FormState } from "@/pageEditor/pageEditorTypes";
import ConfigurationTitle from "./ConfigurationTitle";

const rootModeOptions = [
  { label: "Inherit", value: "inherit" },
  { label: "Document", value: "document" },
];

const targetOptions: Array<Option<BlockWindow>> = [
  { label: "Current Tab (self)", value: "self" },
  { label: "Opener Tab (opener)", value: "opener" },
  { label: "Target Tab (target)", value: "target" },
  { label: "Top-level Frame (top)", value: "top" },
  { label: "All Tabs (broadcast)", value: "broadcast" },
  // Not currently generally available
  // { label: "Server (remote)", value: "remote" },
];

const BlockConfiguration: React.FunctionComponent<{
  name: string;
  blockId: RegistryId;
}> = ({ name, blockId }) => {
  const configName = partial(joinName, name);

  const context = useFormikContext<FormState>();
  const blockErrors = getIn(context.errors, name);

  const [{ block, error }, BlockOptions] = useBlockOptions(blockId);

  // Conditionally show Advanced options "Condition" and "Target" depending on the value of blockType.
  // If blockType is undefined, don't show the options.
  // If error happens, behavior is undefined.
  const [blockType] = useAsyncState(async () => getType(block), [block]);

  const [isRootAware] = useAsyncState(async () => block.isRootAware(), [block]);

  const advancedOptionsRef = useRef<HTMLDivElement>();

  const ifSchemaProps: SchemaFieldProps = useMemo(
    () => ({
      name: configName("if"),
      schema: {
        type: ["string", "number", "boolean"],
      },
      label: "Condition",
      description: (
        <p>
          Condition determining whether or not to execute the brick. Truthy
          string values are&nbsp;
          <code>true</code>, <code>t</code>, <code>yes</code>, <code>y</code>,{" "}
          <code>on</code>, and <code>1</code> (case-insensitive)
        </p>
      ),
    }),
    [configName]
  );

  // Only show if necessary. Currently, only the trigger extension point passes the element
  // that triggered the event through for the reader root
  const showRootMode =
    isRootAware && ["trigger", "contextMenu"].includes(context.values.type);
  const showIfAndTarget = blockType && blockType !== "renderer";
  const noAdvancedOptions = !showRootMode && !showIfAndTarget;

  return (
    <>
      <AdvancedLinks name={name} scrollToRef={advancedOptionsRef} />

      <Card>
        <FieldSection title={<ConfigurationTitle />}>
          <SchemaFieldContext.Provider value={devtoolFieldOverrides}>
            {blockErrors?.id && (
              <div className="invalid-feedback d-block mb-4">
                Unknown block {blockId}
              </div>
            )}
            {BlockOptions ? (
              <BlockOptions name={name} configKey="config" />
            ) : error ? (
              <div className="invalid-feedback d-block mb-4">{error}</div>
            ) : (
              <Loader />
            )}
          </SchemaFieldContext.Provider>
        </FieldSection>

        <FieldSection title="Advanced Options" bodyRef={advancedOptionsRef}>
          {showRootMode && (
            <ConnectedFieldTemplate
              name={configName("rootMode")}
              label="Root Mode"
              as={SelectWidget}
              options={rootModeOptions}
              blankValue="inherit"
              description="The root mode controls which page element PixieBrix provides as the implicit element"
            />
          )}

          {showIfAndTarget && (
            <>
              <SchemaField {...ifSchemaProps} omitIfEmpty />

              <ConnectedFieldTemplate
                name={configName("window")}
                label="Target"
                as={SelectWidget}
                options={targetOptions}
                blankValue={DEFAULT_WINDOW_VALUE}
                description="The tab/frame to run the brick. To ensure PixieBrix has permission to run on the tab, add an Extra Permissions pattern that matches the target tab URL"
              />
            </>
          )}

          {noAdvancedOptions && (
            <small className="text-muted font-italic">No options to show</small>
          )}
        </FieldSection>
      </Card>
    </>
  );
};

export default BlockConfiguration;
