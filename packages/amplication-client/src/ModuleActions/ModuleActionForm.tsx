import { ToggleField } from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { Form } from "../Components/Form";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";

import { DisplayNameField } from "../Components/DisplayNameField";
import NameField from "../Components/NameField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";
import FormikAutoSave from "../util/formikAutoSave";

type Props = {
  onSubmit: (values: models.Module) => void;
  defaultValues?: models.Module;
  disabled?: boolean;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
  "isDefault",
  "lockedByUserId",
  "lockedAt",
  "lockedByUser",
];

export const INITIAL_VALUES: Partial<models.Module> = {
  name: "",
  displayName: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["name", "displayName"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
    displayName: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
};

const ModuleActionForm = ({ onSubmit, defaultValues, disabled }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.Module;
  }, [defaultValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values: models.Module) => validate(values, FORM_SCHEMA)}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Form childrenAsBlocks>
        {!disabled && <FormikAutoSave debounceMS={1000} />}
        <DisplayNameField name="displayName" label="Display Name" />
        <NameField label="Name" name="name" disabled={disabled} />
        <OptionalDescriptionField
          name="description"
          label="Description"
          disabled={disabled}
        />
        <div>
          <ToggleField name="enabled" label="Enabled" disabled={disabled} />
        </div>
      </Form>
    </Formik>
  );
};

export default ModuleActionForm;