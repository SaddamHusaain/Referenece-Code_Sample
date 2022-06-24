import React from 'react';
import "react-phone-input-2/lib/semantic-ui.css";
export declare enum PhoneNumberInputSizes {
    Large = "Large",
    Regular = "Regular"
}
declare type PhoneNumberInputProps = {
    value: string;
    onChange: any;
    onEnter?: any;
    validationError?: string;
    subLabel?: string;
    tip?: string;
    placeholder?: string;
    label?: string;
    phoneNumberInputSize?: string;
    margin?: string;
    autoFocus?: boolean;
};
declare const PhoneNumberInput: React.FC<PhoneNumberInputProps>;
export default PhoneNumberInput;
