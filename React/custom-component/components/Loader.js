import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React from 'react';
import styled from 'styled-components';

var _a;
var LoaderSizes;
(function (LoaderSizes) {
    LoaderSizes["FuckingTiny"] = "FuckingTiny";
    LoaderSizes["SuperSmall"] = "SuperSmall";
    LoaderSizes["VerySmall"] = "VerySmall";
    LoaderSizes["Small"] = "Small";
    LoaderSizes["Medium"] = "Medium";
    LoaderSizes["Large"] = "Large";
})(LoaderSizes || (LoaderSizes = {}));
var LoaderSizesMap = (_a = {},
    _a[LoaderSizes.FuckingTiny] = 14,
    _a[LoaderSizes.SuperSmall] = 20,
    _a[LoaderSizes.VerySmall] = 24,
    _a[LoaderSizes.Small] = 30,
    _a[LoaderSizes.Medium] = 40,
    _a[LoaderSizes.Large] = 60,
    _a);
var scale = function (size, scale) { return size * scale + "px"; };
var StyledLoader = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  top: 1.5px;\n\n  .lds-ring {\n    display: inline-block;\n    position: relative;\n    width: ", ";\n    height: ", ";\n  }\n  .lds-ring div {\n    box-sizing: border-box;\n    display: block;\n    position: absolute;\n    width: ", ";\n    height: ", ";\n    margin: ", ";\n    border: ", " solid ", ";\n    border-radius: 50%;\n    animation: lds-ring 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;\n    border-color: ", " transparent transparent transparent;\n  }\n  .lds-ring div:nth-child(1) {\n    animation-delay: -0.3s;\n  }\n  .lds-ring div:nth-child(2) {\n    animation-delay: -0.2s;\n  }\n  .lds-ring div:nth-child(3) {\n    animation-delay: -0.1s;\n  }\n  @keyframes lds-ring {\n    0% {\n      transform: rotate(0deg);\n    }\n    100% {\n      transform: rotate(360deg);\n    }\n  }\n"], ["\n  position: relative;\n  top: 1.5px;\n\n  .lds-ring {\n    display: inline-block;\n    position: relative;\n    width: ", ";\n    height: ", ";\n  }\n  .lds-ring div {\n    box-sizing: border-box;\n    display: block;\n    position: absolute;\n    width: ", ";\n    height: ", ";\n    margin: ", ";\n    border: ", " solid ", ";\n    border-radius: 50%;\n    animation: lds-ring 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;\n    border-color: ", " transparent transparent transparent;\n  }\n  .lds-ring div:nth-child(1) {\n    animation-delay: -0.3s;\n  }\n  .lds-ring div:nth-child(2) {\n    animation-delay: -0.2s;\n  }\n  .lds-ring div:nth-child(3) {\n    animation-delay: -0.1s;\n  }\n  @keyframes lds-ring {\n    0% {\n      transform: rotate(0deg);\n    }\n    100% {\n      transform: rotate(360deg);\n    }\n  }\n"])), function (props) { return scale(props.size, 1); }, function (props) { return scale(props.size, 1); }, function (props) { return scale(props.size, .8); }, function (props) { return scale(props.size, .8); }, function (props) { return scale(props.size, .1); }, function (props) { return scale(props.size, 0.066); }, function (props) { return props.color; }, function (props) { return props.color; });
function Loader(_a) {
    var _b = _a.size, size = _b === void 0 ? LoaderSizes.Medium : _b, _c = _a.color, color = _c === void 0 ? Colors.White : _c;
    return (React.createElement(StyledLoader, { size: LoaderSizesMap[size], color: color },
        React.createElement("div", { className: "lds-ring" },
            React.createElement("div", null),
            React.createElement("div", null),
            React.createElement("div", null))));
}
var templateObject_1;

export default Loader;
export { LoaderSizes };
