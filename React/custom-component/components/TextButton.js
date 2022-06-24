import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React from 'react';
import styled from 'styled-components';
import Icon from './Icon.js';

var TextButtonSizes;
(function (TextButtonSizes) {
    TextButtonSizes["Large"] = "Large";
    TextButtonSizes["Regular"] = "Regular";
    TextButtonSizes["Small"] = "Small";
})(TextButtonSizes || (TextButtonSizes = {}));
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  margin: ", ";\n"], ["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  margin: ", ";\n"])), function (props) { return props.margin; });
var Text = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: ", ";\n  color: ", ";\n  text-decoration: underline;\n  cursor: pointer;\n  font-weight: 500;\n  &:hover {\n    text-decoration: none;\n  }\n"], ["\n  font-size: ",
    ";\n  color: ", ";\n  text-decoration: underline;\n  cursor: pointer;\n  font-weight: 500;\n  &:hover {\n    text-decoration: none;\n  }\n"])), function (props) {
    if (props.size === TextButtonSizes.Large)
        return "1.8rem";
    if (props.size === TextButtonSizes.Regular)
        return "1.4rem";
    if (props.size === TextButtonSizes.Small)
        return "1.2rem";
    return "1.4rem";
}, function (props) { return props.color; });
var TextButton = function (_a) {
    var children = _a.children, _b = _a.size, size = _b === void 0 ? TextButtonSizes.Regular : _b, onClick = _a.onClick, margin = _a.margin, icon = _a.icon, iconRotation = _a.iconRotation, _c = _a.color, color = _c === void 0 ? Colors.Orange : _c;
    var iconSize = (function () {
        if (size === TextButtonSizes.Large) {
            return 14;
        }
        if (size === TextButtonSizes.Regular) {
            return 12;
        }
        if (size === TextButtonSizes.Small) {
            return 10;
        }
        return 12;
    })();
    return (React.createElement(Container, { onClick: onClick ? onClick : function () { }, margin: margin },
        icon && (React.createElement(Icon, { icon: icon, size: iconSize, color: color, margin: "0 7px 0 0", rotation: iconRotation })),
        React.createElement(Text, { size: size, color: color }, children)));
};
var templateObject_1, templateObject_2;

export default TextButton;
export { TextButtonSizes };
