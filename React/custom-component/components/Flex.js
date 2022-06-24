import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React from 'react';
import styled from 'styled-components';

var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: ", ";\n  justify-content: ", ";\n  align-items: ", ";\n  padding: ", ";\n  margin: ", ";\n  flex: ", ";\n  height: ", ";\n"], ["\n  display: flex;\n  flex-direction: ", ";\n  justify-content: ", ";\n  align-items: ", ";\n  padding: ", ";\n  margin: ", ";\n  flex: ", ";\n  height: ", ";\n"])), function (props) { return props.direction; }, function (props) { return props.justify; }, function (props) { return props.align; }, function (props) { return props.padding; }, function (props) { return props.margin; }, function (props) { return props.flex; }, function (props) { return props.height; });
var Flex = function (_a) {
    var children = _a.children, _b = _a.direction, direction = _b === void 0 ? 'row' : _b, _c = _a.justify, justify = _c === void 0 ? '' : _c, _d = _a.align, align = _d === void 0 ? '' : _d, _e = _a.padding, padding = _e === void 0 ? '' : _e, _f = _a.margin, margin = _f === void 0 ? '' : _f, _g = _a.flex, flex = _g === void 0 ? '' : _g, _h = _a.height, height = _h === void 0 ? '' : _h;
    return (React.createElement(Container, { direction: direction, justify: justify, align: align, padding: padding, margin: margin, flex: flex, height: height }, children));
};
var templateObject_1;

export default Flex;
