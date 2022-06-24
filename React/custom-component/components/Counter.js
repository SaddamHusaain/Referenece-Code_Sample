import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import Icon, { Icons } from './Icon.js';

var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 85px;\n  min-height: 42px;\n  /* background-color: red; */\n"], ["\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 85px;\n  min-height: 42px;\n  /* background-color: red; */\n"])));
var IconContainer = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: ", ";\n  flex: 1;\n  /* background-color: blue; */\n  height: 100%;\n\n  &:hover {\n    cursor: ", ";\n  }\n\n  .svg-inline--fa {\n    color: ", " !important;\n  }\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: ", ";\n  flex: 1;\n  /* background-color: blue; */\n  height: 100%;\n\n  &:hover {\n    cursor: ", ";\n  }\n\n  .svg-inline--fa {\n    color: ",
    " !important;\n  }\n"])), function (props) { return props.justify; }, function (props) { return (props.active ? "pointer" : null); }, function (props) {
    return props.active ? lighten(0.025, Colors.Orange) : null;
});
var Value = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 2.4rem;\n  color: ", ";\n  min-width: 20px;\n  text-align: center;\n"], ["\n  font-size: 2.4rem;\n  color: ", ";\n  min-width: 20px;\n  text-align: center;\n"])), Colors.Grey1);
function Counter(_a) {
    var value = _a.value, maxValue = _a.maxValue, _b = _a.minValue, minValue = _b === void 0 ? 0 : _b, onIncrement = _a.onIncrement, onDecrement = _a.onDecrement;
    var canDecrement = value > minValue;
    var canIncrement = Boolean(!Boolean(maxValue) || (maxValue && value < maxValue));
    return (React.createElement(Container, null,
        value > 0 && (React.createElement(Fragment, null,
            React.createElement(IconContainer, { active: canDecrement, onClick: function () { return (canDecrement ? onDecrement() : null); }, justify: "flex-start" },
                React.createElement(Icon, { icon: Icons.MinusCircleLight, color: canDecrement ? Colors.Orange : Colors.Grey5, size: 24 })),
            React.createElement(Value, null, value))),
        React.createElement(IconContainer, { active: canIncrement, onClick: function () { return (canIncrement ? onIncrement() : null); }, justify: "flex-end" },
            React.createElement(Icon, { icon: Icons.PlusCircleLight, color: canIncrement ? Colors.Orange : Colors.Grey5, size: 24 }))));
}
var templateObject_1, templateObject_2, templateObject_3;

export default Counter;
