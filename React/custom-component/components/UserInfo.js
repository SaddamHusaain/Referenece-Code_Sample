import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React from 'react';
import styled from 'styled-components';
import UserImage from './UserImage.js';

var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n"], ["\n  display: flex;\n"])));
var Details = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n"], ["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n"])));
var Name = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 1.4rem;\n  color: ", ";\n  font-weight: 600;\n"], ["\n  font-size: 1.4rem;\n  color: ", ";\n  font-weight: 600;\n"])), Colors.Grey1);
var Email = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 1.2rem;\n  color: ", ";\n"], ["\n  font-size: 1.2rem;\n  color: ", ";\n"])), Colors.Grey2);
var PhoneNumber = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 1.2rem;\n  color: ", ";\n"], ["\n  font-size: 1.2rem;\n  color: ", ";\n"])), Colors.Grey2);
var UserInfoSizeEnum;
(function (UserInfoSizeEnum) {
    UserInfoSizeEnum["Regular"] = "Regular";
    UserInfoSizeEnum["Large"] = "Large";
})(UserInfoSizeEnum || (UserInfoSizeEnum = {}));
var UserInfo = function (_a) {
    var _b = _a.user, user = _b === void 0 ? {} : _b, _c = _a.size, size = _c === void 0 ? UserInfoSizeEnum.Regular : _c, _d = _a.invert, invert = _d === void 0 ? false : _d;
    var firstName = user.firstName, lastName = user.lastName, email = user.email, phoneNumber = user.phoneNumber, _e = user.userProfile, _f = (_e === void 0 ? {} : _e).imageUrl, imageUrl = _f === void 0 ? '' : _f;
    var isLarge = size === UserInfoSizeEnum.Large;
    var UserName = React.memo(function () { return React.createElement(Name, null,
        firstName,
        "\u00A0",
        lastName); });
    var UserEmail = React.memo(function () { return React.createElement(Email, null, email); });
    var UserPhoneNumber = React.memo(function () { return React.createElement(PhoneNumber, null, phoneNumber); });
    var height = isLarge ? '50px' : '36px';
    return (React.createElement(Container, null,
        React.createElement(UserImage, { imageUrl: imageUrl, height: height, size: isLarge ? "1.8rem" : "1.4rem", firstName: firstName, lastName: lastName, invert: invert }),
        React.createElement(Details, null,
            firstName && lastName && React.createElement(UserName, null),
            email && React.createElement(UserEmail, null),
            isLarge && phoneNumber && React.createElement(UserPhoneNumber, null))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;

export default UserInfo;
export { UserInfoSizeEnum };
