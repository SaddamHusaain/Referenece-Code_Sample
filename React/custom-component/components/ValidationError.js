import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React from 'react';
import styled from 'styled-components';
import Icon, { Icons } from './Icon.js';
import { FadeIn } from './Motion.js';

var ValidationErrorRelative = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var ValidationErrorAbsolute = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  z-index: 700;\n  width: fit-content;\n  height: 50px;\n"], ["\n  position: absolute;\n  z-index: 700;\n  width: fit-content;\n  height: 50px;\n"])));
var ValidationErrorBox = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  background: ", ";\n  border: 1px solid ", ";\n  box-sizing: border-box;\n  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  margin-top: 5px;\n  padding:  10px 15px;\n  width: fit-content;\n  justify-content: center;\n"], ["\n  background: ", ";\n  border: 1px solid ", ";\n  box-sizing: border-box;\n  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  margin-top: 5px;\n  padding:  10px 15px;\n  width: fit-content;\n  justify-content: center;\n"])), Colors.White, Colors.Grey5);
var ValidationErrorText = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-left: 10px;\n  font-weight: 500;\n  color: ", ";\n"], ["\n  margin-left: 10px;\n  font-weight: 500;\n  color: ", ";\n"])), Colors.Grey2);
var ValidationError = function (_a) {
    var validationError = _a.validationError;
    return (React.createElement(ValidationErrorRelative, null,
        React.createElement(ValidationErrorAbsolute, null,
            React.createElement(FadeIn, null,
                React.createElement(ValidationErrorBox, null,
                    React.createElement(Icon, { icon: Icons.Warning, size: 16, color: Colors.Yellow }),
                    React.createElement(ValidationErrorText, null, validationError))))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;

export default ValidationError;
