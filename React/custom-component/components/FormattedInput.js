import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React, { useState } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import Icon, { Icons } from './Icon.js';
import Label from './Label.js';
import Flex from './Flex.js';
import MaxLength from './MaxLength.js';
import ValidationError from './ValidationError.js';
import { media } from '../utils/MediaQuery.js';

var InputFormats;
(function (InputFormats) {
    InputFormats["Price"] = "Price";
    InputFormats["Percent"] = "Percent";
})(InputFormats || (InputFormats = {}));
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: ", ";\n"], ["\n  width: ", ";\n"])), function (props) { return props.width; });
var Form = styled.form(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: ", ";\n  width: ", ";\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  position: relative;\n  border-radius: 10px;\n  transition: all 0.2s;\n  border: 1px solid\n    ", ";\n  overflow: hidden;\n"], ["\n  margin: ", ";\n  width: ", ";\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  position: relative;\n  border-radius: 10px;\n  transition: all 0.2s;\n  border: 1px solid\n    ",
    ";\n  overflow: hidden;\n"])), function (props) { return props.margin; }, function (props) { return props.width; }, function (props) {
    if (props.focused)
        return Colors.Grey4;
    if (props.hovered)
        return darken(0.05, Colors.Grey5);
    return Colors.Grey5;
});
var PriceContainer = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 25px;\n  background-color: ", ";\n"], ["\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 25px;\n  background-color: ", ";\n"])), Colors.Grey5);
var InputStyled = styled.input(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  background-color: ", ";\n  color: ", ";\n  outline: none;\n  border: 0px;\n  height: 38px;\n  width: 40px;\n  font-family: \"neue-haas-grotesk-display\", sans-serif;\n  font-weight: 500;\n  text-indent: 1px;\n  transition: all 0.2s;\n  padding: 0 16px;\n  text-align: right;\n\n  ", ";\n\n  ", ";\n\n  ::placeholder {\n    color: ", ";\n  }\n"], ["\n  background-color: ",
    ";\n  color: ", ";\n  outline: none;\n  border: 0px;\n  height: 38px;\n  width: 40px;\n  font-family: \"neue-haas-grotesk-display\", sans-serif;\n  font-weight: 500;\n  text-indent: 1px;\n  transition: all 0.2s;\n  padding: 0 16px;\n  text-align: right;\n\n  ",
    ";\n\n  ",
    ";\n\n  ::placeholder {\n    color: ", ";\n  }\n"])), function (props) {
    return props.disabled ? Colors.Grey6 + " !important" : null;
}, function (props) { return (props.disabled ? Colors.Grey4 : Colors.Grey1); }, media.mobile(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    font-size: 1.6rem;\n  "], ["\n    font-size: 1.6rem;\n  "]))), media.desktop(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    font-size: 1.4rem;\n  "], ["\n    font-size: 1.4rem;\n  "]))), Colors.Grey4);
var IconText = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-size: 1.4rem;\n  font-weight: 600;\n  color: ", ";\n"], ["\n  font-size: 1.4rem;\n  font-weight: 600;\n  color: ", ";\n"])), Colors.Grey3);
function Input(_a) {
    var inputRef = _a.inputRef, autoFocus = _a.autoFocus, placeholder = _a.placeholder, value = _a.value, defaultValue = _a.defaultValue, _b = _a.format, format = _b === void 0 ? InputFormats.Price : _b, _c = _a.type, type = _c === void 0 ? "text" : _c, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, onChange = _a.onChange, onFocus = _a.onFocus, onBlur = _a.onBlur, onSubmit = _a.onSubmit, _d = _a.canSubmit, canSubmit = _d === void 0 ? true : _d, loading = _a.loading, margin = _a.margin, width = _a.width, onEnter = _a.onEnter, label = _a.label, subLabel = _a.subLabel, tip = _a.tip, maxLength = _a.maxLength, validationError = _a.validationError, _e = _a.disabled, disabled = _e === void 0 ? false : _e;
    var _f = useState(false), hovered = _f[0], setHovered = _f[1];
    var _g = useState(false), focused = _g[0], setFocused = _g[1];
    var submit = function (event) {
        event.preventDefault();
        if (onSubmit && canSubmit && !loading) {
            onSubmit();
        }
        else if (onEnter && !loading) {
            onEnter();
        }
    };
    return (React.createElement(Container, { width: width },
        React.createElement(Flex, { justify: "space-between" },
            label && React.createElement(Label, { text: label, subText: subLabel, tip: tip }),
            maxLength && React.createElement(MaxLength, { value: value, maxLength: maxLength })),
        React.createElement(Form, { hovered: hovered, focused: focused, onSubmit: function (event) { return submit(event); }, width: width, margin: margin, noValidate // disables default html5 validation
            : true, disabled: disabled },
            format === InputFormats.Price && (React.createElement(PriceContainer, null,
                React.createElement(Icon, { icon: Icons.Dollar, size: 14, color: Colors.Grey3 }))),
            React.createElement(InputStyled, { ref: inputRef, disabled: disabled, autoFocus: autoFocus, placeholder: placeholder, value: value, defaultValue: defaultValue, type: type, onChange: function (e) {
                    if (maxLength && e.currentTarget.value.length > maxLength) ;
                    else {
                        onChange(e);
                    }
                }, onFocus: function (event) {
                    setFocused(true);
                    if (onFocus)
                        onFocus(event);
                }, onBlur: function (event) {
                    setFocused(false);
                    if (onFocus)
                        onBlur(event);
                }, onMouseEnter: function (event) {
                    setHovered(true);
                    if (onMouseEnter)
                        onMouseEnter(event);
                }, onMouseLeave: function (event) {
                    setHovered(false);
                    if (onMouseLeave)
                        onMouseLeave(event);
                } }),
            format === InputFormats.Percent && (React.createElement(PriceContainer, null,
                React.createElement(IconText, null, "%")))),
        validationError && (React.createElement(ValidationError, { validationError: validationError }))));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;

export default Input;
export { InputFormats };
