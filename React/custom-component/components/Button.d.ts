/// <reference types="react" />
import { Colors } from '../Colors';
export declare enum ButtonTypes {
    Next = "Next",
    Regular = "Regular",
    Thin = "Thin"
}
export declare enum ButtonStates {
    Active = "Active",
    Warning = "Warning",
    Disabled = "Disabled"
}
export declare enum ButtonIconPosition {
    Left = "Left",
    Right = "Right"
}
export declare type ButtonProps = {
    type?: ButtonTypes;
    state?: ButtonStates;
    bgColor?: Colors;
    textColor?: Colors;
    text?: string;
    onClick?: any;
    icon?: any;
    iconPosition?: ButtonIconPosition;
    iconSize?: number;
    margin?: string;
    loading?: boolean;
    label?: string;
    tip?: string;
    subLabel?: string;
};
export default function Button({ type, state, bgColor, textColor, text, onClick, icon, iconPosition, iconSize, margin, loading, }: ButtonProps): JSX.Element;
