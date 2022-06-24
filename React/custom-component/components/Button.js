import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { lighten, darken } from 'polished';
import Icon from './Icon.js';
import Loader, { LoaderSizes } from './Loader.js';

var ButtonTypes;
(function (ButtonTypes) {
    ButtonTypes["Next"] = "Next";
    ButtonTypes["Regular"] = "Regular";
    ButtonTypes["Thin"] = "Thin";
})(ButtonTypes || (ButtonTypes = {}));
var ButtonStates;
(function (ButtonStates) {
    ButtonStates["Active"] = "Active";
    ButtonStates["Warning"] = "Warning";
    ButtonStates["Disabled"] = "Disabled";
})(ButtonStates || (ButtonStates = {}));
var ButtonIconPosition;
(function (ButtonIconPosition) {
    ButtonIconPosition["Left"] = "Left";
    ButtonIconPosition["Right"] = "Right";
})(ButtonIconPosition || (ButtonIconPosition = {}));
var StyledButton = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  height: ", ";\n  width: ", ";\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  overflow: hidden;\n  justify-content: center;\n  white-space: nowrap;\n  box-sizing: border-box;\n  text-align: center;\n  border-radius: 10px;\n  transition: all 0.2s;\n  margin: ", ";\n  padding: ", ";\n  background-color: ", ";\n  border: ", ";\n\n  &:hover {\n    cursor: ", ";\n    background-color: ", ";\n  }\n\n  &:active {\n    cursor: ", ";\n    background-color: ", ";\n  }\n"], ["\n  position: relative;\n  height: ",
    ";\n  width: ",
    ";\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  overflow: hidden;\n  justify-content: center;\n  white-space: nowrap;\n  box-sizing: border-box;\n  text-align: center;\n  border-radius: 10px;\n  transition: all 0.2s;\n  margin: ", ";\n  padding: ",
    ";\n  background-color: ",
    ";\n  border: ",
    ";\n\n  &:hover {\n    cursor: ",
    ";\n    background-color: ",
    ";\n  }\n\n  &:active {\n    cursor: ",
    ";\n    background-color: ",
    ";\n  }\n"])), function (props) {
    if (props.type === ButtonTypes.Next) {
        return "48px";
    }
    if (props.type === ButtonTypes.Regular) {
        return "40px";
    }
    if (props.type === ButtonTypes.Thin) {
        if (props.state === ButtonStates.Warning) {
            return "28px";
        }
        return "30px";
    }
    return null;
}, function (props) {
    if (props.type === ButtonTypes.Next) {
        return "100%";
    }
    if (props.type === ButtonTypes.Regular) {
        return "fit-content";
    }
    if (props.type === ButtonTypes.Thin) {
        return "fit-content";
    }
    return null;
}, function (props) { return (Boolean(props.margin) ? props.margin : "0px"); }, function (props) {
    if (props.type === ButtonTypes.Next) {
        return "0px";
    }
    if (props.type === ButtonTypes.Regular) {
        return "0 25px";
    }
    if (props.type === ButtonTypes.Thin) {
        return "0 15px";
    }
    return null;
}, function (props) {
    if (props.state === ButtonStates.Disabled) {
        return Colors.Grey6;
    }
    if (props.state === ButtonStates.Warning) {
        return Colors.White;
    }
    return props.bgColor || Colors.Orange;
}, function (props) {
    if (props.state === ButtonStates.Warning) {
        return "1px solid " + Colors.Grey5;
    }
    return null;
}, function (props) {
    if (props.state === ButtonStates.Disabled) {
        return null;
    }
    return props.onClick ? "pointer" : null;
}, function (props) {
    if (props.state === ButtonStates.Disabled) {
        return Colors.Grey6;
    }
    if (props.state === ButtonStates.Warning) {
        return Colors.White;
    }
    return lighten(0.025, props.bgColor || Colors.Orange);
}, function (props) {
    if (props.state === ButtonStates.Disabled) {
        return null;
    }
    return props.onClick ? "pointer" : null;
}, function (props) {
    if (props.state === ButtonStates.Disabled) {
        return Colors.Grey6;
    }
    if (props.state === ButtonStates.Warning) {
        return Colors.White;
    }
    return darken(0.025, props.bgColor || Colors.Orange);
});
var Text = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n  font-size: ", ";\n  font-weight: ", ";\n  text-transform: uppercase;\n  margin: ", ";\n  color: ", ";\n  top: ", ";\n"], ["\n  position: relative;\n  font-size: ",
    ";\n  font-weight: ",
    ";\n  text-transform: uppercase;\n  margin: ",
    ";\n  color: ",
    ";\n  top: ",
    ";\n"])), function (props) {
    if (props.type === ButtonTypes.Next) {
        return "1.4rem";
    }
    if (props.type === ButtonTypes.Regular) {
        return "1.4rem";
    }
    if (props.type === ButtonTypes.Regular) {
        return "1.2rem";
    }
    if (props.type === ButtonTypes.Thin) {
        return "1.2rem";
    }
    return null;
}, function (props) {
    if (props.type === ButtonTypes.Next) {
        return "600";
        // return "700";
    }
    if (props.type === ButtonTypes.Regular) {
        return "600";
        // return "700";
    }
    if (props.type === ButtonTypes.Thin) {
        return "600";
    }
    return null;
}, function (props) {
    if (props.type === ButtonTypes.Next) {
        return "0 10px";
    }
    if (props.type === ButtonTypes.Regular) {
        if (props.iconPosition === ButtonIconPosition.Left) {
            return "0 0 0 10px";
        }
        if (props.iconPosition === ButtonIconPosition.Right) {
            return "0 10px 0 0";
        }
        return "0";
    }
    if (props.type === ButtonTypes.Thin) {
        if (props.iconPosition === ButtonIconPosition.Left) {
            return "0 0 0 7px";
        }
        if (props.iconPosition === ButtonIconPosition.Right) {
            return "0 7px 0 0";
        }
        return "0";
    }
    return null;
}, function (props) {
    if (props.state)
        if (props.state === ButtonStates.Disabled) {
            return Colors.Grey5;
        }
    if (props.state === ButtonStates.Warning) {
        return Colors.Grey3;
    }
    return props.textColor || Colors.White;
}, function (props) {
    if (props.type === ButtonTypes.Thin) {
        if (props.icon) {
            return '-1px';
        }
        return "0";
    }
    return null;
});
function Button(_a) {
    var _b = _a.type, type = _b === void 0 ? ButtonTypes.Next : _b, _c = _a.state, state = _c === void 0 ? ButtonStates.Active : _c, bgColor = _a.bgColor, textColor = _a.textColor, text = _a.text, _d = _a.onClick, onClick = _d === void 0 ? function () { } : _d, icon = _a.icon, iconPosition = _a.iconPosition, _e = _a.iconSize, iconSize = _e === void 0 ? 14 : _e, 
    // label,
    // tip,
    // subLabel,
    margin = _a.margin, _f = _a.loading, loading = _f === void 0 ? false : _f;
    var iconColor = state === ButtonStates.Disabled ? Colors.Grey3 : Colors.White;
    if (icon && !iconPosition)
        iconPosition = ButtonIconPosition.Left;
    var iconEl = (React.createElement(Icon, { icon: icon, color: iconColor, size: iconSize, top: iconSize < 14 ? "-1px" : undefined }));
    var click = loading || state === ButtonStates.Disabled ? null : function () { return onClick(); };
    return (React.createElement(React.Fragment, null,
        React.createElement(StyledButton, { type: type, state: state, onClick: click, margin: margin, bgColor: bgColor }, (function () {
            return (React.createElement(Fragment, null, (function () {
                if (loading) {
                    return (React.createElement(Fragment, null,
                        React.createElement(Loader, { size: LoaderSizes.VerySmall, color: iconColor })));
                }
                return (React.createElement(Fragment, null,
                    icon && iconPosition === ButtonIconPosition.Left && iconEl,
                    text && (React.createElement(Text, { type: type, state: state, icon: Boolean(icon), iconPosition: iconPosition, textColor: textColor }, text)),
                    icon &&
                        iconPosition === ButtonIconPosition.Right && iconEl));
            })()));
        })())));
}
var templateObject_1, templateObject_2;

export default Button;
export { ButtonIconPosition, ButtonStates, ButtonTypes };
