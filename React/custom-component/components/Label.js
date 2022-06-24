import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React from 'react';
import styled from 'styled-components';
import Tip from './Tip.js';

var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  margin: ", ";\n  height: 15px;\n"], ["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  margin: ", ";\n  height: 15px;\n"])), function (props) { return props.margin; });
var Text = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 1.2rem;\n  font-weight: 600;\n  color: ", ";\n  margin-right: 7px;\n"], ["\n  font-size: 1.2rem;\n  font-weight: 600;\n  color: ", ";\n  margin-right: 7px;\n"])), Colors.Grey1);
var SubText = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), Colors.Grey3);
var Label = function (_a) {
    var text = _a.text, subText = _a.subText, tip = _a.tip, _b = _a.margin, margin = _b === void 0 ? '0 0 8px' : _b;
    return (React.createElement(Container, { margin: margin },
        React.createElement(Text, null,
            text,
            subText && React.createElement(SubText, null,
                "\u00A0",
                subText)),
        tip && (React.createElement(Tip, { tip: tip }))));
};
var templateObject_1, templateObject_2, templateObject_3;

export default Label;
