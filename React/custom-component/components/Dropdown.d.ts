import React from "react";
export interface IDropdownItem {
    text: string;
    value: any;
    icon?: React.ReactNode;
    color?: string;
}
export declare enum DropdownTypes {
    Regular = "Regular",
    Small = "Small"
}
declare type DropdownProps = {
    type?: DropdownTypes;
    value?: string;
    onChange: Function;
    placeholder?: string;
    width?: string;
    items: IDropdownItem[];
    label?: string;
    tip?: string;
    icon?: React.ReactNode;
};
declare const Dropdown: React.FC<DropdownProps>;
export default Dropdown;
