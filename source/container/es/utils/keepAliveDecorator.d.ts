import React from 'react';
export declare enum COMMAND {
    UNMOUNT = "unmount",
    MOUNT = "mount",
    CURRENT_UNMOUNT = "current_unmount"
}
/**
 * Decorating the <KeepAlive> component, the main function is to listen to events emitted by the upper <KeepAlive> component, triggering events of the current <KeepAlive> component.
 *
 * @export
 * @template P
 * @param {React.ComponentType<any>} Component
 * @returns {React.ComponentType<P>}
 */
export default function keepAliveDecorator<P = any>(Component: React.ComponentType<any>): React.ComponentType<P>;
