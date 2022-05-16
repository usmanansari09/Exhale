import * as React from "react";
import "./input.css";

/**
 * This component is an input field.
 * It accepts a css class name, receives props and onChange Event.
 * Can be used anywhere.
 */

const defaultProps = {
  className: "",
  Input: "text",
  checked: "",
};

function Input(props) {
  return (
    <>
      {props.type === "checkbox" ? (
        <>
          <label className="checkbox-label">
            <input
              className={`${props.className} ${
                props.error ? "error-color" : ""
              }`}
              id={props.id}
              type={props.type}
              onChange={props.onChange}
              onBlur={props.onBlur}
              name={props.name}
              checked={props.isChecked}
              value={props.value}
              disabled={props.disabled}
              maxLength={props.maxLength}
              defaultChecked={props.defaultChecked}
            />
            <span className="checkbox-custom rectangular"></span>
          </label>
        </>
      ) : (
        <>
          <input
            className={`${props.className} ${props.error ? "error-color" : ""}`}
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
            onChange={props.onChange}
            onBlur={props.onBlur}
            name={props.name}
            value={props.value}
            disabled={props.disabled}
            maxLength={props.maxLength}
          />
        </>
      )}
      {props.error && <span className="error">{props.error}</span>}
    </>
  );
}

Input.defaultProps = defaultProps;
export default Input;
