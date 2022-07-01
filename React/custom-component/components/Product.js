import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { lighten, darken } from 'polished';
import Counter from './Counter.js';
import AnimateHeight from 'react-animate-height';
import { output } from '@test/utils/.dist/price';

var Row = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: row;\n  justify-content: ", ";\n"], ["\n  display: flex;\n  flex-direction: row;\n  justify-content: ", ";\n"])), function (props) { return props.justify; });
var Column = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n"], ["\n  display: flex;\n  flex-direction: column;\n"])));
var Container = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  background-color: ", ";\n  margin: 0 24px;\n  padding: 24px 0;\n  border-bottom: 1px solid ", ";\n"], ["\n  background-color: ", ";\n  margin: 0 24px;\n  padding: 24px 0;\n  border-bottom: 1px solid ", ";\n"])), Colors.White, Colors.Grey6);
var Title = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 1.8rem;\n  color: ", ";\n  font-weight: 600;\n  margin-bottom: 5px;\n"], ["\n  font-size: 1.8rem;\n  color: ", ";\n  font-weight: 600;\n  margin-bottom: 5px;\n"])), Colors.Grey1);
var Price = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 1.6rem;\n  font-weight: 500;\n  color: ", ";\n  margin-bottom: 5px;\n"], ["\n  font-size: 1.6rem;\n  font-weight: 500;\n  color: ", ";\n  margin-bottom: 5px;\n"])), Colors.Grey2);
var Subtitle = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-size: 1.2rem;\n  font-weight: 500;\n  line-height: 160%;\n  color: ", ";\n"], ["\n  font-size: 1.2rem;\n  font-weight: 500;\n  line-height: 160%;\n  color: ", ";\n"])), Colors.Grey3);
var Description = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-size: 1.2rem;\n  font-weight: 500;\n  line-height: 160%;\n  color: ", ";\n  margin-top: 10px;\n"], ["\n  font-size: 1.2rem;\n  font-weight: 500;\n  line-height: 160%;\n  color: ", ";\n  margin-top: 10px;\n"])), Colors.Grey2);
var Ellipsis = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-line-clamp: ", ";\n  -webkit-box-orient: ", ";\n  overflow: hidden;\n  text-overflow: ellipsis;\n"], ["\n  display: -webkit-box;\n  -webkit-line-clamp: ", ";\n  -webkit-box-orient: ", ";\n  overflow: hidden;\n  text-overflow: ellipsis;\n"])), function (props) { return props.active ? 3 : null; }, function (props) { return props.active ? 'vertical' : null; });
var ShowMore = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  font-size: 1.2rem;\n  font-weight: 500;\n  line-height: 160%;\n  color: ", ";\n  transition: all 0.2s;\n\n  &:hover {\n    cursor: pointer;\n    color: ", ";\n  }\n\n  &:active {\n    color: ", ";\n  }\n"], ["\n  font-size: 1.2rem;\n  font-weight: 500;\n  line-height: 160%;\n  color: ", ";\n  transition: all 0.2s;\n\n  &:hover {\n    cursor: pointer;\n    color: ", ";\n  }\n\n  &:active {\n    color: ", ";\n  }\n"])), Colors.Orange, lighten(0.025, Colors.Orange), darken(0.025, Colors.Orange));
function Product(_a) {
    var _b = _a.title, title = _b === void 0 ? '' : _b, _c = _a.price, price = _c === void 0 ? 0 : _c, _d = _a.isRSVP, isRSVP = _d === void 0 ? false : _d, _e = _a.subtitle, subtitle = _e === void 0 ? '' : _e, _f = _a.description, description = _f === void 0 ? '' : _f,
        // Counter Props
        value = _a.value, minValue = _a.minValue, maxValue = _a.maxValue, onIncrement = _a.onIncrement, onDecrement = _a.onDecrement;
    var _g = useState(false), showMore = _g[0], setShowMore = _g[1];
    var _h = useState(true), showEllipsis = _h[0], setShowEllipsis = _h[1];
    var descModified = description;
    if (descModified.length > 210 && !showMore) {
        descModified = descModified.substring(0, 210) + '...';
    }
    var toggle = function () {
        setShowEllipsis(!showEllipsis);
        setShowMore(!showMore);
    };
    return (React.createElement(Container, null,
        React.createElement(Row, { justify: "space-between" },
            React.createElement(Column, null,
                React.createElement(Title, null, title),
                React.createElement(Price, null, isRSVP ? 'RSVP' : "$" + output(price, true))),
            React.createElement(Counter, { value: value, minValue: minValue, maxValue: maxValue, onIncrement: onIncrement, onDecrement: onDecrement })),
        React.createElement(Row, null, subtitle && React.createElement(Subtitle, null, subtitle)),
        (function () {
            if (!description)
                return;
            return (React.createElement(Fragment, null,
                React.createElement(AnimateHeight, { height: showMore ? "auto" : 67 },
                    React.createElement(Ellipsis, { active: showEllipsis },
                        React.createElement(Description, null, description))),
                React.createElement(ShowMore, { onClick: function () { return toggle(); } }, showMore ? "Show Less" : "Show More")));
        })()));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;

export default Product;
