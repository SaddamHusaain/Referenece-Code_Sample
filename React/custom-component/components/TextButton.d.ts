import React from "react";
import { Colors } from '../Colors';
export declare enum TextButtonSizes {
    Large = "Large",
    Regular = "Regular",
    Small = "Small"
}
declare type TextButtonProps = {
    children: string | React.ReactNode;
    size?: TextButtonSizes;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    margin?: string;
    icon?: any;
    iconRotation?: number;
    color?: Colors;
};
declare const TextButton: React.FC<TextButtonProps>;
export default TextButton;
