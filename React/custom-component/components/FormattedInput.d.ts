import React from "react";
export declare enum InputFormats {
    Price = "Price",
    Percent = "Percent"
}
export declare type InputProps = {
    inputRef?: React.Ref<HTMLInputElement>;
    autoFocus?: boolean | undefined;
    placeholder?: string;
    value: string;
    defaultValue?: string;
    type?: string;
    format?: InputFormats;
    onMouseEnter?: any;
    onMouseLeave?: any;
    onChange?: any;
    onFocus?: any;
    onBlur?: any;
    onSubmit?: Function;
    canSubmit?: boolean;
    loading?: boolean;
    margin?: string;
    width?: string;
    onEnter?: Function;
    label?: string;
    subLabel?: string;
    tip?: string;
    maxLength?: number;
    validationError?: string;
    disabled?: boolean;
};
export default function Input({ inputRef, autoFocus, placeholder, value, defaultValue, format, type, onMouseEnter, onMouseLeave, onChange, onFocus, onBlur, onSubmit, canSubmit, loading, margin, width, onEnter, label, subLabel, tip, maxLength, validationError, disabled, }: InputProps): JSX.Element;
