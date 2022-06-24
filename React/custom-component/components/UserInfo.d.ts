import React from 'react';
export declare enum UserInfoSizeEnum {
    Regular = "Regular",
    Large = "Large"
}
declare type UserInfoPropTypes = {
    user?: any;
    size?: UserInfoSizeEnum;
    invert?: boolean;
};
declare const UserInfo: React.FC<UserInfoPropTypes>;
export default UserInfo;
