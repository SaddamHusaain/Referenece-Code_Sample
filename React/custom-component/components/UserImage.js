import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React from 'react';
import styled from 'styled-components';
import Icon, { Icons } from './Icon.js';

var UserImageDiv = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: ", ";\n  height: ", ";\n  width: ", ";\n  min-height: ", ";\n  min-width: ", ";\n  border-radius: ", ";\n  color: ", ";\n  font-size: ", ";\n  font-weight: 600;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: ", ";\n  background-image: ", ";\n  background-position: center;\n  background-size: cover;\n"], ["\n  background-color: ",
    ";\n  height: ", ";\n  width: ", ";\n  min-height: ", ";\n  min-width: ", ";\n  border-radius: ", ";\n  color: ", ";\n  font-size: ", ";\n  font-weight: 600;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: ", ";\n  background-image: ", ";\n  background-position: center;\n  background-size: cover;\n"])), function (props) {
    if (props.src) {
        if (props.invert) {
            return Colors.Grey6;
        }
        else {
            return Colors.Grey6;
        }
    }
    else if (props.invert) {
        return Colors.White;
    }
    else {
        return Colors.Grey1;
    }
}, function (props) { return props.height; }, function (props) { return props.height; }, function (props) { return props.height; }, function (props) { return props.height; }, function (props) { return (props.circle ? '50%' : '0'); }, function (props) { return (props.invert ? Colors.Grey1 : Colors.White); }, function (props) { return props.size; }, function (props) { return props.margin || '0px 10px 0px 0px'; }, function (props) { return "url(" + props.src + ")"; });
var UserImage = function (_a) {
    var imageUrl = _a.imageUrl, _b = _a.height, height = _b === void 0 ? '45px' : _b, _c = _a.size, size = _c === void 0 ? '1.8rem' : _c, firstName = _a.firstName, lastName = _a.lastName, margin = _a.margin, invert = _a.invert, _d = _a.circle, circle = _d === void 0 ? true : _d;
    if (!imageUrl) {
        var userInitials = '';
        if (firstName && lastName) {
            userInitials = "" + firstName.split('')[0] + lastName.split('')[0];
        }
        return (React.createElement(UserImageDiv, { height: height, margin: margin, invert: invert, size: size, circle: circle }, userInitials ? userInitials : (React.createElement(Icon, { icon: Icons.UserSolid, color: invert ? Colors.Grey1 : Colors.White, size: 16 }))));
    }
    return (React.createElement(UserImageDiv, { src: imageUrl, height: height, margin: margin, circle: circle }));
};
var templateObject_1;

export default UserImage;
