import React, { HTMLInputTypeAttribute } from "react";

interface Props {
  isLoading: boolean;
  title?: string;
  type?: HTMLInputTypeAttribute;
  color?: string;
  size?: string;
}

const SubmitButton = ({ title, type, color, size, isLoading }: Props) => {
  return (
    <input
      type={type ?? "submit"}
      className={`btn ${size} btn-${color ?? "dark"}`}
      disabled={isLoading}
      value={isLoading ? "Please wait..." : title ?? "Submit"}
    />
  );
};

export default SubmitButton;
