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

import React from "react";
import { SchemaFieldProps } from "@/components/fields/schemaFields/propTypes";
import ConnectedFieldTemplate from "@/components/form/ConnectedFieldTemplate";
import SwitchButtonWidget from "@/components/form/widgets/switchButton/SwitchButtonWidget";
import { makeLabelForSchemaField } from "@/components/fields/schemaFields/schemaFieldUtils";

const BooleanField: React.FunctionComponent<SchemaFieldProps> = (props) => {
  const { name, schema } = props;
  return (
    <ConnectedFieldTemplate
      name={name}
      as={SwitchButtonWidget}
      label={makeLabelForSchemaField(props)}
      description={schema.description}
    />
  );
};

export default BooleanField;
