import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";

const isFormFieldInvalid = (name, formik) => {
  return !!(formik.touched[name] && formik.errors[name]);
};

const getFormErrorMessage = (name, formik) => {
  //console.log(formik.touched[name] , formik.errors[name]);
  return formik.touched[name] !== undefined &&
    formik.errors[name] !== undefined &&
    isFormFieldInvalid(name, formik) ? (
    <small className="p-error">{formik.errors[name]}</small>
  ) : (
    <small className="p-error">&nbsp;</small>
  );
};

export function Input(props) {
  return (
    <span className="p-float-label  align-items-center gap-2 input-margin">
      {props.type == "calendar" && (
        <Calendar
          id={props.name}
          name={props.name}
          value={props.formik.values.value}
          dateFormat={props.dateFormat} showTime={props.showTime} hourFormat={props.hourFormat}
          onChange={(e) => {
            props.formik.setFieldValue(props.name, e.target.value);
          }}
          className={classNames({
            "p-invalid": isFormFieldInvalid(props.name, props.formik),
          })}
        />
      )}
      {(props.type == "text" || props.type == "password") && (
        <InputText
          id={props.name}
          type={props.type}
          name={props.name}
          value={props.formik.values.value}
          onChange={(e) => {
            props.formik.setFieldValue(props.name, e.target.value);
          }}
          className={classNames({
            "p-invalid": isFormFieldInvalid(props.name, props.formik),
          })}
        />
      )}
      {props.type == "mask" && (
        <InputMask
          id={props.name}
          name={props.name}
          value={props.formik.values.value}
          mask={props.mask}
          onChange={(e) => {
            props.formik.setFieldValue(props.name, e.target.value);
          }}
          className={classNames({
            "p-invalid": isFormFieldInvalid(props.name, props.formik),
          })}
        />
      )}

      {props.type == "autoComplete" && (
        <AutoComplete
          id={props.name}
          name={props.name}
          value={props.value}
          field={props.field}
          multiple={props.multiple}
          suggestions={props.suggestions}
          completeMethod={props.completeMethod}
          onChange={props.onChange}
          className={classNames({
            "p-invalid": isFormFieldInvalid(props.name, props.formik),
          })}
        />
      )}

      {props.type == "dropdown" && (
        <Dropdown
          id={props.name}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          options={props.options}
          optionLabel={props.optionLabel}
          placeholder={props.placeholder}
          className={classNames(
            {
              "p-invalid": isFormFieldInvalid(props.name, props.formik),
            },
            "w-full md:w-14rem"
          )}
        />
      )}

      <label htmlFor={props.name}>{props.title}</label>
      <div>{getFormErrorMessage(props.name, props.formik)}</div>
    </span>
  );
}
