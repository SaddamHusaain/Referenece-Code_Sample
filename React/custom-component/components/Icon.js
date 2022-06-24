import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconEnum } from './Icons.js';

var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", ";\n\n  &:hover {\n    color: ", ";\n  }\n"], ["\n  color: ", ";\n\n  &:hover {\n    color: ",
    ";\n  }\n"])), function (props) { return props.color; }, function (props) {
    if (props.color === "inherit")
        return null;
    return props.hoverColor;
});
var Icons = IconEnum;
function Icon(_a) {
    var _b = _a.icon, icon = _b === void 0 ? Icons.AudienceRegular : _b, _c = _a.color, color = _c === void 0 ? Colors.Orange : _c, _d = _a.hoverColor, hoverColor = _d === void 0 ? null : _d, onClick = _a.onClick, _e = _a.size, size = _e === void 0 ? 20 : _e, top = _a.top, left = _a.left, right = _a.right, _f = _a.position, position = _f === void 0 ? "relative" : _f, zIndex = _a.zIndex, margin = _a.margin, tip = _a.tip, transitionDuration = _a.transitionDuration, rotation = _a.rotation;
    var cursor = onClick ? "pointer" : "";
    if (icon === Icons.TicketRegular)
        rotation = 90;
    if (icon === Icons.TicketSolid)
        rotation = 90;
    return (React.createElement(Container, { color: color, hoverColor: hoverColor, "data-tip": tip },
        React.createElement(FontAwesomeIcon, { icon: icon, onClick: onClick, style: {
                top: top,
                left: left,
                right: right,
                position: position,
                zIndex: zIndex,
                fontSize: size,
                transition: "all " + (transitionDuration || "0.2s"),
                transform: rotation ? "rotate(" + rotation + "deg)" : undefined,
                margin: margin,
                cursor: cursor,
            } })));
}
var templateObject_1;

export default Icon;
export { Icons };
