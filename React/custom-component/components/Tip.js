import { Colors } from '../Colors.js';
import { __makeTemplateObject } from '../_virtual/_tslib.js';
import React, { useLayoutEffect } from 'react';
import styled from 'styled-components';
import Icon, { Icons } from './Icon.js';

var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin: ", ";\n"], ["\n  margin: ", ";\n"])), function (props) { return props.margin; });
var Tip = function (_a) {
    var tip = _a.tip, margin = _a.margin;
    useLayoutEffect(function () {
        // ReactTooltip.rebuild();
    }, []);
    return (React.createElement(Container, { margin: margin, "data-tip": tip },
        React.createElement(Icon, { icon: Icons.InfotipSolid, color: Colors.Grey4, size: 12 })));
};
var templateObject_1;

export default Tip;
