import React from "react";
import { FieldError, RegisterOptions } from "react-hook-form";

type Props = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export default function InputField({
  label,
  type,
  register,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
}: Props) {
  return (
    <div className={hidden ? "hidden" : "flex w-full flex-col gap-2 md:w-1/4"}>
      <label htmlFor="username" className="text-xs text-gray-500">
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        className="rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <span className="text-xs text-red-500">{error.message.toString()}</span>
      )}
    </div>
  );
}
