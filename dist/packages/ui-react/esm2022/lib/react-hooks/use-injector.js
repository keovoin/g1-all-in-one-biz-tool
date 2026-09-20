import { useContext } from 'react';
import { NgBridgeContext } from '../ng-react-context';
export function useInjector(token) {
    const ctx = useContext(NgBridgeContext);
    if (!ctx) {
        throw new Error('useInjector must be used within NgContextProvider');
    }
    if (token != null) {
        return ctx.injector.get(token);
    }
    return ctx.injector;
}
//# sourceMappingURL=use-injector.js.map