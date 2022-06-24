import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import Icon, { Icons } from './Icon.js';
import Label from './Label.js';
import Flex from './Flex.js';

var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  height: 65px;\n  width: ", ";\n"], ["\n  position: relative;\n  height: 65px;\n  width: ", ";\n"])), function (props) { return props.width; });
var FieldContainer = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  height: ", ";\n  width: ", ";\n  background-color: ", ";\n  border: 1px solid ", ";\n  box-sizing: border-box;\n  border-radius: 8px;\n  transition: all 0.2s;\n  z-index: ", ";\n  box-shadow: ", ";\n  overflow: hidden;\n  outline: none;\n\n  &:hover {\n    cursor: pointer;\n    border: 1px solid ", ";\n  }\n\n  &:focus {\n    border: 1px solid ", ";\n  }\n"], ["\n  position: absolute;\n  height: ", ";\n  width: ", ";\n  background-color: ", ";\n  border: 1px solid ", ";\n  box-sizing: border-box;\n  border-radius: 8px;\n  transition: all 0.2s;\n  z-index: ", ";\n  box-shadow: ",
    ";\n  overflow: hidden;\n  outline: none;\n\n  &:hover {\n    cursor: pointer;\n    border: 1px solid ", ";\n  }\n\n  &:focus {\n    border: 1px solid ", ";\n  }\n"])), function (props) { return (props.open ? props.height : "38px"); }, function (props) { return props.width; }, Colors.White, Colors.Grey5, function (props) { return (props.open ? 100 : 0); }, function (props) {
    return props.open ? "0px 4px 16px rgba(0, 0, 0, 0.05)" : "";
}, darken(0.05, Colors.Grey5), Colors.Grey4);
var TopRow = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n  height: 38px;\n  padding: 0 15px;\n"], ["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n  height: 38px;\n  padding: 0 15px;\n"])));
var Value = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 1.4rem;\n  font-weight: 500;\n  color: ", ";\n  font-family: \"neue-haas-grotesk-display\", sans-serif;\n  font-weight: 500;\n  margin-right: 10px;\n  white-space: nowrap;\n"], ["\n  font-size: 1.4rem;\n  font-weight: 500;\n  color: ", ";\n  font-family: \"neue-haas-grotesk-display\", sans-serif;\n  font-weight: 500;\n  margin-right: 10px;\n  white-space: nowrap;\n"])), Colors.Grey1);
var ItemsContainer = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n  height: ", ";\n  overflow: ", ";\n"], ["\n  position: relative;\n  height: ", ";\n  overflow: ", ";\n"])), function (props) { return (props.open ? props.height : "0px"); }, function (props) { return (props.open ? "scroll" : "hidden"); });
var Item = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  position: relative;\n  display: flex;\n  align-items: center;\n  height: 30px;\n  padding: 0 15px;\n  background-color: ", ";\n  font-size: 1.2rem;\n  color: ", ";\n  transition: all 0.2s;\n\n  &:hover {\n    cursor: pointer;\n    background-color: ", ";\n  }\n"], ["\n  position: relative;\n  display: flex;\n  align-items: center;\n  height: 30px;\n  padding: 0 15px;\n  background-color: ",
    ";\n  font-size: 1.2rem;\n  color: ", ";\n  transition: all 0.2s;\n\n  &:hover {\n    cursor: pointer;\n    background-color: ", ";\n  }\n"])), function (props) {
    return props.selected ? Colors.Grey7 : Colors.White;
}, Colors.Grey1, Colors.Grey7);
var DropdownTypes;
(function (DropdownTypes) {
    DropdownTypes["Regular"] = "Regular";
    DropdownTypes["Small"] = "Small";
})(DropdownTypes || (DropdownTypes = {}));
var Dropdown = function (_a) {
    var 
    // type = DropdownTypes.Regular,
    value = _a.value, onChange = _a.onChange, _b = _a.width, width = _b === void 0 ? 'auto' : _b, items = _a.items, label = _a.label, tip = _a.tip, icon = _a.icon;
    var _c = React.useState(false), open = _c[0], setOpen = _c[1];
    return (React.createElement(Container, { width: width },
        label && React.createElement(Label, { text: label, tip: tip }),
        React.createElement(FieldContainer, { tabIndex: 1, open: open, height: items.length > 4 ? "163px" : items.length * 30 + 43 + "px", width: width, onClick: function () { return setOpen(!open); }, onBlur: function () { return setOpen(false); } },
            React.createElement(TopRow, null,
                React.createElement(Flex, { align: "center" },
                    icon && icon,
                    React.createElement(Value, null, value)),
                React.createElement(Icon, { icon: Icons.Sort, size: 12, color: Colors.Grey1 })),
            React.createElement(ItemsContainer, { open: open, height: items.length > 3 ? "120px" : items.length * 30 + "px" }, items === null || items === void 0 ? void 0 : items.map(function (item, index) {
                return (React.createElement(Item, { key: index, selected: false, onClick: function () { return onChange(item.value); } },
                    item.icon && item.icon,
                    item.text));
            })))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;

export default Dropdown;
export { DropdownTypes };
