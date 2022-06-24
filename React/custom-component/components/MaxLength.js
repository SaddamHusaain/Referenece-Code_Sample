import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React from 'react';
import styled from 'styled-components';

var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  font-size: 1.2rem;\n  font-weight: 500;\n  color: ", ";\n  margin-bottom: 10px;\n"], ["\n  display: flex;\n  align-items: center;\n  font-size: 1.2rem;\n  font-weight: 500;\n  color: ", ";\n  margin-bottom: 10px;\n"])), function (props) { return (props.isMax ? Colors.Red : Colors.Grey3); });
var MaxLength = function (_a) {
    var value = _a.value, maxLength = _a.maxLength;
    return (React.createElement(Container, { isMax: value.length === maxLength },
        value.length,
        "/",
        maxLength));
};
var templateObject_1;

export default MaxLength;
