import { __rest, __assign } from '../_virtual/_tslib.js';
import React from 'react';
import { motion } from 'framer-motion';

var ErrorPop = function (_a) {
    var _b = _a.duration, children = _a.children, props = __rest(_a, ["duration", "children"]);
    return (React.createElement(motion.div, __assign({}, props, { initial: { right: -100 }, animate: { right: 15 }, transition: {
            // duration: duration as any,
            type: "spring",
            stiffness: 400,
            damping: 20,
        } }), children));
};
var Pop = function (_a) {
    var _b = _a.duration, children = _a.children, props = __rest(_a, ["duration", "children"]);
    return (React.createElement(motion.div, __assign({}, props, { initial: { scale: 0.8 }, animate: { scale: 1 }, transition: {
            // duration,
            type: "spring",
            stiffness: 260,
            damping: 20,
        } }), children));
};
var CardPop = function (_a) {
    var _b = _a.duration, duration = _b === void 0 ? 0.2 : _b, children = _a.children, props = __rest(_a, ["duration", "children"]);
    return (React.createElement(motion.div, __assign({}, props, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: {
            duration: duration,
            // type: 'spring',
            stiffness: 260,
            damping: 20,
        } }), children));
};
var FadeIn = function (_a) {
    var _b = _a.duration, duration = _b === void 0 ? 0.2 : _b, children = _a.children, props = __rest(_a, ["duration", "children"]);
    return (React.createElement(motion.div, __assign({}, props, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: {
            duration: duration,
        } }), children));
};

export { CardPop, ErrorPop, FadeIn, Pop };
