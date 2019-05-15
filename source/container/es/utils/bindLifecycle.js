var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import noop from './noop';
import { warn } from './debug';
import { COMMAND } from './keepAliveDecorator';
import withIdentificationContextConsumer from './withIdentificationContextConsumer';
import getDisplayName from './getDisplayName';
export default function bindLifecycle(Component) {
    var WrappedComponent = Component.WrappedComponent || Component.wrappedComponent || Component;
    var _a = WrappedComponent.prototype, _b = _a.componentDidMount, componentDidMount = _b === void 0 ? noop : _b, _c = _a.componentDidUpdate, componentDidUpdate = _c === void 0 ? noop : _c, _d = _a.componentWillUnmount, componentWillUnmount = _d === void 0 ? noop : _d;
    WrappedComponent.prototype.componentDidMount = function () {
        var _this = this;
        componentDidMount.call(this);
        this._needActivate = false;
        var _a = this.props._container, identification = _a.identification, eventEmitter = _a.eventEmitter;
        this._unmounted = false;
        eventEmitter.on([identification, COMMAND.MOUNT], this._bindMount = function () { return _this._needActivate = true; }, true);
        eventEmitter.on([identification, COMMAND.UNMOUNT], this._bindUnmount = function () {
            componentWillUnmount.call(_this);
            _this._unmounted = true;
        }, true);
    };
    WrappedComponent.prototype.componentDidUpdate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._needActivate) {
            this._needActivate = false;
            this._unmounted = false;
            componentDidMount.call(this);
        }
        else {
            componentDidUpdate.apply(this, args);
        }
    };
    WrappedComponent.prototype.componentWillUnmount = function () {
        if (!this._unmounted) {
            componentWillUnmount.call(this);
        }
        var _a = this.props._container, identification = _a.identification, eventEmitter = _a.eventEmitter;
        eventEmitter.off([identification, COMMAND.MOUNT], this._bindMount);
        eventEmitter.off([identification, COMMAND.UNMOUNT], this._bindUnmount);
    };
    var BindLifecycleHOC = withIdentificationContextConsumer(function (_a) {
        var forwardRef = _a.forwardRef, _b = _a._identificationContextProps, identification = _b.identification, eventEmitter = _b.eventEmitter, wrapperProps = __rest(_a, ["forwardRef", "_identificationContextProps"]);
        if (!identification) {
            warn('[React Keep Alive] You should not use bindLifecycle outside a <KeepAlive>.');
            return null;
        }
        return (React.createElement(Component, __assign({}, wrapperProps, { ref: forwardRef || noop, _container: {
                identification: identification,
                eventEmitter: eventEmitter,
            } })));
    });
    var BindLifecycle = React.forwardRef(function (props, ref) { return (React.createElement(BindLifecycleHOC, __assign({}, props, { forwardRef: ref }))); });
    BindLifecycle.WrappedComponent = WrappedComponent;
    BindLifecycle.displayName = "bindLifecycle(" + getDisplayName(Component) + ")";
    return hoistNonReactStatics(BindLifecycle, Component);
}
//# sourceMappingURL=bindLifecycle.js.map