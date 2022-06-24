import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import Icon, { Icons } from './Icon.js';
import Loader, { LoaderSizes } from './Loader.js';
import Label from './Label.js';
import Flex from './Flex.js';
import MaxLength from './MaxLength.js';
import ValidationError from './ValidationError.js';
import { media } from '../utils/MediaQuery.js';

var InputSizes;
(function (InputSizes) {
    InputSizes["Large"] = "Large";
    InputSizes["Regular"] = "Regular";
})(InputSizes || (InputSizes = {}));
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: ", ";\n  margin: ", ";\n"], ["\n  width: ", ";\n  margin: ", ";\n"])), function (props) { return props.width; }, function (props) { return props.margin; });
var Form = styled.form(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: ", ";\n  display: flex;\n  flex-direction: row;\n  position: relative;\n  border-radius: 10px;\n  transition: all 0.2s;\n  border: 1px solid\n    ", ";\n  overflow: hidden;\n  background-color: ", ";\n\n  > * {\n    background-color: ", ";\n  }\n"], ["\n  width: ", ";\n  display: flex;\n  flex-direction: row;\n  position: relative;\n  border-radius: 10px;\n  transition: all 0.2s;\n  border: 1px solid\n    ",
    ";\n  overflow: hidden;\n  background-color: ", ";\n\n  > * {\n    background-color: ", ";\n  }\n"])), function (props) { return props.width; }, function (props) {
    if (props.focused)
        return Colors.Grey4;
    if (props.hovered)
        return darken(0.05, Colors.Grey5);
    return Colors.Grey5;
}, function (props) { return props.disabled ? Colors.Grey6 + " !important" : null; }, function (props) { return props.disabled ? Colors.Grey6 + " !important" : null; });
var Button = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: ", ";\n  height: ", ";\n  width: ", ";\n  border-radius: 0 10px 10px 0;\n  top: -1px;\n  right: -1px;\n  transition: all 0.2s;\n\n  &:hover {\n    cursor: ", ";\n  }\n\n  &:active {\n    cursor: ", ";\n  }\n"], ["\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: ", ";\n  height: ",
    ";\n  width: ",
    ";\n  border-radius: 0 10px 10px 0;\n  top: -1px;\n  right: -1px;\n  transition: all 0.2s;\n\n  &:hover {\n    cursor: ", ";\n  }\n\n  &:active {\n    cursor: ", ";\n  }\n"])), Colors.White, function (props) {
    if (props.size === InputSizes.Large)
        return "50px";
    if (props.size === InputSizes.Regular)
        return "40px";
    return null;
}, function (props) {
    if (props.size === InputSizes.Large)
        return "50px";
    if (props.size === InputSizes.Regular)
        return "40px";
    return null;
}, function (props) { return (props.onClick ? "pointer" : null); }, function (props) { return (props.onClick ? "pointer" : null); });
var IconContainer = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 18px;\n"], ["\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 18px;\n"])));
var LeftContainer = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-left: 16px;\n  top: 0px;\n  left: 0px;\n  background-color: ", ";\n"], ["\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-left: 16px;\n  top: 0px;\n  left: 0px;\n  background-color: ", ";\n"])), Colors.White);
var RightContainer = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: ", ";\n  width: ", ";\n  top: -1px;\n  right: -1px;\n  background-color: ", ";\n\n  &:hover {\n    cursor: ", ";\n  }\n"], ["\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: ",
    ";\n  width: ",
    ";\n  top: -1px;\n  right: -1px;\n  background-color: ", ";\n\n  &:hover {\n    cursor: ", ";\n  }\n"])), function (props) {
    if (props.size === InputSizes.Large)
        return "50px";
    if (props.size === InputSizes.Regular)
        return "40px";
    return null;
}, function (props) {
    if (props.size === InputSizes.Large)
        return "50px";
    if (props.size === InputSizes.Regular)
        return "40px";
    return null;
}, Colors.White, function (props) { return (props.onClick ? "pointer" : null); });
var Spacer = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  width: 50px;\n  background-color: ", ";\n"], ["\n  width: 50px;\n  background-color: ", ";\n"])), Colors.White);
var InputStyled = styled.input(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  background-color: ", ";\n  color: ", ";\n  outline: none;\n  border: 0px;\n  /* border-radius: 10px; */\n  height: ", ";\n  width: fill-available;\n  font-family: \"neue-haas-grotesk-display\", sans-serif;\n  font-weight: 500;\n  padding: 0px;\n  padding-left: ", ";\n  transition: all 0.2s;\n  padding: ", ";\n\n  ::placeholder {\n    color: ", ";\n  }\n\n  ", ";\n\n  ", ";\n"], ["\n  background-color: ", ";\n  color: ", ";\n  outline: none;\n  border: 0px;\n  /* border-radius: 10px; */\n  height: ",
    ";\n  width: fill-available;\n  font-family: \"neue-haas-grotesk-display\", sans-serif;\n  font-weight: 500;\n  padding: 0px;\n  padding-left: ", ";\n  transition: all 0.2s;\n  padding: ", ";\n\n  ::placeholder {\n    color: ", ";\n  }\n\n  ",
    ";\n\n  ",
    ";\n"])), Colors.White, function (props) { return props.disabled ? Colors.Grey4 : Colors.Grey1; }, function (props) {
    if (props.inputSize === InputSizes.Large)
        return "48px";
    if (props.inputSize === InputSizes.Regular)
        return "38px";
    return null;
}, function (props) { return props.hasIcon ? '8px' : '16px'; }, function (props) { return props.padding; }, Colors.Grey4, media.mobile(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  font-size: 1.6rem;\n"], ["\n  font-size: 1.6rem;\n"]))), media.desktop(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  font-size: 1.4rem;\n"], ["\n  font-size: 1.4rem;\n"]))));
function Input(_a) {
    var inputRef = _a.inputRef, autoFocus = _a.autoFocus, placeholder = _a.placeholder, value = _a.value, defaultValue = _a.defaultValue, icon = _a.icon, iconColor = _a.iconColor, _b = _a.size, size = _b === void 0 ? InputSizes.Regular : _b, _c = _a.type, type = _c === void 0 ? "text" : _c, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, onChange = _a.onChange, onFocus = _a.onFocus, onBlur = _a.onBlur, onSubmit = _a.onSubmit, onClear = _a.onClear, _d = _a.canSubmit, canSubmit = _d === void 0 ? true : _d, loading = _a.loading, margin = _a.margin, padding = _a.padding, width = _a.width, onEnter = _a.onEnter, label = _a.label, subLabel = _a.subLabel, tip = _a.tip, maxLength = _a.maxLength, iconConditionalColor = _a.iconConditionalColor, validationError = _a.validationError, _e = _a.disabled, disabled = _e === void 0 ? false : _e;
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
    var iconSize = (function () {
        if (size === InputSizes.Large)
            return 16;
        if (size === InputSizes.Regular)
            return 14;
        return 14;
    })();
    var submitIconSize = (function () {
        if (size === InputSizes.Large)
            return 18;
        if (size === InputSizes.Regular)
            return 16;
        return 16;
    })();
    return (React.createElement(Container, { width: width, margin: margin },
        React.createElement(Flex, { justify: "space-between" },
            label && React.createElement(Label, { text: label, subText: subLabel, tip: tip }),
            maxLength && React.createElement(MaxLength, { value: value, maxLength: maxLength })),
        React.createElement(Form, { hovered: hovered, focused: focused, onSubmit: function (event) { return submit(event); }, width: width, disabled: disabled, noValidate // disables default html5 validation
            : true },
            icon && (React.createElement(LeftContainer, { size: size },
                React.createElement(IconContainer, null,
                    React.createElement(Icon, { icon: icon, size: iconSize, color: (function () {
                            if (iconColor)
                                return iconColor;
                            return value
                                ? iconConditionalColor || Colors.Grey1
                                : focused
                                    ? Colors.Grey3
                                    : Colors.Grey4;
                        })() })))),
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
                }, padding: padding, inputSize: size, hasIcon: Boolean(icon) }),
            (function () {
                if (onSubmit) {
                    return (React.createElement(Fragment, null,
                        React.createElement(Spacer, null),
                        React.createElement(Button, { canSubmit: canSubmit, onClick: function (event) { return submit(event); }, size: size }, (function () {
                            if (loading) {
                                return React.createElement(Loader, { size: LoaderSizes.VerySmall, color: Colors.Orange });
                            }
                            return (React.createElement(Icon, { icon: Icons.RightChevronCircle, color: canSubmit ? Colors.Orange : Colors.Grey5, size: submitIconSize }));
                        })())));
                }
                if (loading) {
                    return (React.createElement(Fragment, null,
                        React.createElement(Spacer, null),
                        React.createElement(RightContainer, { size: size },
                            React.createElement(Loader, { size: LoaderSizes.SuperSmall, color: Colors.Orange }))));
                }
                if (Boolean(value) && onClear) {
                    return (React.createElement(Fragment, null,
                        React.createElement(Spacer, null),
                        React.createElement(RightContainer, { onClick: function () { return onClear(); }, size: size },
                            React.createElement(Icon, { icon: Icons.CancelCircle, color: Colors.Grey4, hoverColor: Colors.Grey3, size: iconSize }))));
                }
                return React.createElement(Spacer, null);
            })()),
        validationError && React.createElement(ValidationError, { validationError: validationError })));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;

export default Input;
export { InputSizes };
