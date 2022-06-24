import React from "react";
import { Colors } from "../Colors";
export declare enum InputSizes {
    Large = "Large",
    Regular = "Regular"
}
export declare type InputProps = {
    inputRef?: React.Ref<HTMLInputElement>;
    autoFocus?: boolean | undefined;
    placeholder?: string;
    value: string;
    defaultValue?: string;
    icon?: any;
    iconColor?: Colors;
    type?: string;
    size?: InputSizes;
    onMouseEnter?: any;
    onMouseLeave?: any;
    onChange?: any;
    onFocus?: any;
    onBlur?: any;
    onSubmit?: Function;
    onClear?: Function;
    canSubmit?: boolean;
    loading?: boolean;
    margin?: string;
    padding?: string;
    width?: string;
    onEnter?: Function;
    label?: string;
    subLabel?: string;
    tip?: string;
    maxLength?: number;
    iconConditionalColor?: any;
    validationError?: string;
    disabled?: boolean;
};
export default function Input({ inputRef, autoFocus, placeholder, value, defaultValue, icon, iconColor, size, type, onMouseEnter, onMouseLeave, onChange, onFocus, onBlur, onSubmit, onClear, canSubmit, loading, margin, padding, width, onEnter, label, subLabel, tip, maxLength, iconConditionalColor, validationError, disabled, }: InputProps): JSX.Element;
