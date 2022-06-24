import { Colors } from '../Colors.js';
import { __makeTemplateObject, __spreadArrays } from '../_virtual/_tslib.js';
import React, { useState } from 'react';
import styled from 'styled-components';

var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject([" \n  margin: ", ";\n"], [" \n  margin: ", ";\n"])), function (props) { return props.margin; });
var Input = styled.input(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border: 2px solid ", ";\n  height: 70px;\n  width: 55px;\n  border-radius: 10px;\n  background-color: white;\n  transition: all 0.1s;\n  margin-right: 10px;\n  outline: 0px;\n  font-size: 24px;\n  text-align: center;\n  padding: 0px;\n  box-shadow: none;\n  -moz-appearance: textfield;\n\n  &:focus {\n    border: 2px solid ", ";\n  }\n\n  &::-webkit-inner-spin-button, ::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n"], ["\n  border: 2px solid ", ";\n  height: 70px;\n  width: 55px;\n  border-radius: 10px;\n  background-color: white;\n  transition: all 0.1s;\n  margin-right: 10px;\n  outline: 0px;\n  font-size: 24px;\n  text-align: center;\n  padding: 0px;\n  box-shadow: none;\n  -moz-appearance: textfield;\n\n  &:focus {\n    border: 2px solid ", ";\n  }\n\n  &::-webkit-inner-spin-button, ::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n"])), Colors.Grey5, Colors.Grey1);
var CodeInput = function (_a) {
    var onChange = _a.onChange, onComplete = _a.onComplete, _b = _a.length, length = _b === void 0 ? 4 : _b;
    var _c = useState(new Array(length).fill('')), value = _c[0], setValue = _c[1];
    var inputs = [];
    var change = function (valueAt, index) {
        var currentValue = __spreadArrays(value);
        // Single Character Press
        if (valueAt.length === 1) {
            currentValue[index] = valueAt;
            setValue(currentValue);
            if (inputs[index + 1]) {
                inputs[index + 1].focus();
            }
        }
        else if (valueAt.length === length) { //code pasted
            setValue(valueAt.split(''));
            onComplete(valueAt);
            if (inputs[index + 1]) {
                inputs[index + 1].focus();
            }
        }
        else if (valueAt.length > 0 && valueAt.length < length) { // More than 1 character, less than the total number required
            change(valueAt.charAt(valueAt.length - 1), index);
        }
        if (index + 1 === length) {
            onComplete(currentValue.join(''));
        }
    };
    var renderInput = function (index) {
        var curValue = value[index];
        return (React.createElement(Input, { key: index, autoFocus: index === 0, value: curValue, type: "number", pattern: "\\d*", ref: function (ref) { return inputs[index] = ref; }, onChange: function (event) {
                onChange();
                change(event.target.value, index);
            }, onKeyDown: function (event) {
                if (event.keyCode === 8 || event.keyCode === 46) { // handle backspace or delete
                    event.preventDefault();
                    var currentValue = __spreadArrays(value);
                    currentValue[index] = '';
                    setValue(currentValue);
                    if (index !== 0) {
                        inputs[index - 1].focus();
                    }
                }
                else if (event.keyCode === 37) { // navigate left with left arrow key
                    event.preventDefault();
                    if (index !== 0) {
                        inputs[index - 1].focus();
                    }
                }
                else if (event.keyCode === 39) { // navigate right with right arrow key
                    event.preventDefault();
                    if (index !== value.length - 1) {
                        inputs[index + 1].focus();
                    }
                }
                else if ( // prohibit weird behavior when up, down, +, or - are pressed
                event.keyCode === 38
                    || event.keyCode === 40
                    || event.keyCode === 107
                    || event.keyCode === 109) {
                    event.preventDefault();
                }
            } }));
    };
    return (React.createElement(Container, null, value.map(function (_, index) {
        return renderInput(index);
    })));
};
var templateObject_1, templateObject_2;

export default CodeInput;
