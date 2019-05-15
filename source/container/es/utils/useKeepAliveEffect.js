import { useEffect, useContext } from 'react';
import { warn } from './debug';
import { COMMAND } from './keepAliveDecorator';
import IdentificationContext from '../contexts/IdentificationContext';
export default function useKeepAliveEffect(effect) {
    if (!useEffect) {
        warn('[React Keep Alive] useKeepAliveEffect API requires react 16.8 or later.');
    }
    var _a = useContext(IdentificationContext), eventEmitter = _a.eventEmitter, identification = _a.identification;
    useEffect(function () {
        var bindMount = null;
        var bindUnmount = null;
        var effectResult = effect();
        var unmounted = false;
        eventEmitter.on([identification, COMMAND.MOUNT], bindMount = function () {
            effectResult = effect();
            unmounted = false;
        }, true);
        eventEmitter.on([identification, COMMAND.UNMOUNT], bindUnmount = function () {
            if (effectResult) {
                effectResult();
                unmounted = true;
            }
        }, true);
        return function () {
            if (effectResult && !unmounted) {
                effectResult();
            }
            eventEmitter.off([identification, COMMAND.MOUNT], bindMount);
            eventEmitter.off([identification, COMMAND.UNMOUNT], bindUnmount);
        };
    }, []);
}
//# sourceMappingURL=useKeepAliveEffect.js.map