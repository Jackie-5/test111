var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from 'react';
import { START_MOUNTING_DOM, LIFECYCLE } from './Provider';
import keepAlive, { COMMAND } from '../utils/keepAliveDecorator';
import changePositionByComment from '../utils/changePositionByComment';
var KeepAlive = /** @class */ (function (_super) {
    __extends(KeepAlive, _super);
    function KeepAlive() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bindUnmount = null;
        return _this;
    }
    KeepAlive.prototype.componentDidMount = function () {
        var _this = this;
        var _container = this.props._container;
        var notNeedActivate = _container.notNeedActivate, identification = _container.identification, eventEmitter = _container.eventEmitter;
        notNeedActivate();
        var cb = function () {
            _this.mount();
            _this.listen();
            eventEmitter.off([identification, START_MOUNTING_DOM], cb);
        };
        eventEmitter.on([identification, START_MOUNTING_DOM], cb);
    };
    KeepAlive.prototype.componentDidUpdate = function () {
        var _container = this.props._container;
        var notNeedActivate = _container.notNeedActivate, isNeedActivate = _container.isNeedActivate;
        if (isNeedActivate()) {
            notNeedActivate();
            this.mount();
            this.listen();
        }
    };
    KeepAlive.prototype.componentWillUnmount = function () {
        this.unmount();
        this.unlisten();
    };
    KeepAlive.prototype.mount = function () {
        var _a = this.props._container, cache = _a.cache, identification = _a.identification, storeElement = _a.storeElement, setLifecycle = _a.setLifecycle;
        var renderElement = cache[identification].renderElement;
        setLifecycle(LIFECYCLE.UPDATING);
        changePositionByComment(identification, renderElement, storeElement);
    };
    KeepAlive.prototype.unmount = function () {
        var _a = this.props._container, identification = _a.identification, storeElement = _a.storeElement, cache = _a.cache, setLifecycle = _a.setLifecycle;
        var _b = cache[identification], renderElement = _b.renderElement, ifStillActivate = _b.ifStillActivate, reactivate = _b.reactivate;
        setLifecycle(LIFECYCLE.UNMOUNTED);
        changePositionByComment(identification, storeElement, renderElement);
        if (ifStillActivate) {
            reactivate();
        }
    };
    KeepAlive.prototype.listen = function () {
        var _a = this.props._container, identification = _a.identification, eventEmitter = _a.eventEmitter;
        eventEmitter.on([identification, COMMAND.CURRENT_UNMOUNT], this.bindUnmount = this.componentWillUnmount.bind(this));
    };
    KeepAlive.prototype.unlisten = function () {
        var _a = this.props._container, identification = _a.identification, eventEmitter = _a.eventEmitter;
        eventEmitter.off([identification, COMMAND.CURRENT_UNMOUNT], this.bindUnmount);
    };
    KeepAlive.prototype.render = function () {
        return this.props.children;
    };
    return KeepAlive;
}(React.PureComponent));
export default keepAlive(KeepAlive);
//# sourceMappingURL=KeepAlive.js.map