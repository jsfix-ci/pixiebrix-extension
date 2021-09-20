/*
 * Copyright (C) 2021 PixieBrix, Inc.
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
import { CustomFieldWidget } from "@/components/form/FieldTemplate";
import { useField } from "formik";
import Select from "react-select";
import { getErrorMessage } from "@/errors";

export type Option = {
  label: string;
  value: unknown;
};

type OwnProps = {
  isClearable?: boolean;
  options: Option[];
  isLoading?: boolean;
  loadingMessage?: string;
  error?: unknown;
};

const SelectWidget: CustomFieldWidget<OwnProps> = ({
  options,
  isClearable = false,
  isLoading,
  loadingMessage: string,
  loadError,
  disabled,
  ...props
}) => {
  const [field, , helpers] = useField<unknown>(props);

  if (loadError) {
    return (
      <div className="text-danger">
        Error loading options: {getErrorMessage(loadError)}
      </div>
    );
  }

  return (
    <Select
      isDisabled={disabled}
      isLoading={isLoading}
      isClearable={isClearable}
      options={options}
      value={options.filter((option: Option) => field.value === option.value)}
      onChange={(option) => {
        console.debug("Selecting option", { options, option, field });
        helpers.setValue(option.value);
      }}
    />
  );
};

export default SelectWidget;