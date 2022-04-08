// react:
import { default as React, useRef, useCallback, } from 'react'; // base technology of our nodestrap components
import { 
// styles:
createSheet, 
// compositions:
globalDef, vars, 
// rules:
atRoot, } from '@cssfn/cssfn'; // cssfn core
// nodestrap utilities:
import { useIsomorphicLayoutEffect, // TODO: replace with useInsertionEffect
 } from '@nodestrap/hooks';
const defaultElementSizeOptions = { box: 'border-box' };
const defaultWindowSizeOptions = { box: 'content-box' };
// utilities:
const createCssSize = (size, options) => {
    const { width, height } = size;
    const { varWidth, varHeight } = options;
    // conditions:
    const hasWidth = ((width !== null) && !!varWidth);
    const hasHeight = ((height !== null) && !!varHeight);
    if (!hasWidth && !hasHeight)
        return; // nothing to update
    // setups:
    const sheet = createSheet(() => [
        globalDef([
            atRoot([
                hasWidth && vars({
                    [varWidth]: `${width}px`,
                }),
                hasHeight && vars({
                    [varHeight]: `${height}px`,
                }),
            ]),
        ]),
    ])
        .attach();
    // cleanups:
    return () => {
        sheet.detach();
    };
};
export const useElementOnResize = (resizingElementRef, elementResizeCallback, options = defaultElementSizeOptions) => {
    // dom effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const resizingElement = resizingElementRef.current;
        if (!resizingElement)
            return;
        // handlers:
        const handleResize = () => {
            elementResizeCallback(resizingElement);
        };
        // setups:
        const observer = new ResizeObserver(handleResize);
        observer.observe(resizingElement, options);
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, [resizingElementRef, elementResizeCallback]);
};
export const useElementSize = (resizingElementRef, elementSizeCallback, options = defaultElementSizeOptions) => {
    const isBorderBox = (options.box === 'border-box');
    const elementResizeCallback = useCallback((elm) => {
        elementSizeCallback({
            width: (isBorderBox ? elm.offsetWidth : elm.clientWidth),
            height: (isBorderBox ? elm.offsetHeight : elm.clientHeight),
        }, elm);
    }, [isBorderBox, elementSizeCallback]);
    useElementOnResize(resizingElementRef, elementResizeCallback, options);
};
export const useElementCssSize = (resizingElementRef, options) => {
    const prevCssSize = useRef(undefined);
    const elementSizeCallback = useCallback((size) => {
        prevCssSize.current?.(); // cleanup prev
        prevCssSize.current = createCssSize(size, options);
    }, [prevCssSize, options]);
    useElementSize(resizingElementRef, elementSizeCallback, { ...defaultElementSizeOptions, ...options });
    useIsomorphicLayoutEffect(() => {
        // cleanups:
        return () => {
            prevCssSize.current?.(); // cleanup prev
            prevCssSize.current = undefined;
        };
    }, []); // runs once
};
export const useWindowOnResize = (windowResizeCallback) => {
    // dom effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (typeof (window) === 'undefined')
            return;
        // handlers:
        const handleResize = () => {
            windowResizeCallback(window);
        };
        // setups:
        window.addEventListener('resize', handleResize);
        handleResize(); // the first trigger
        // cleanups:
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [windowResizeCallback]);
};
export const useWindowSize = (windowSizeCallback, options = defaultWindowSizeOptions) => {
    const isBorderBox = (options.box === 'border-box');
    const windowResizeCallback = useCallback((window) => {
        windowSizeCallback({
            width: (isBorderBox ? window.outerWidth : window.innerWidth),
            height: (isBorderBox ? window.outerHeight : window.innerHeight),
        }, window);
    }, [isBorderBox, windowSizeCallback]);
    useWindowOnResize(windowResizeCallback);
};
export const useWindowCssSize = (options) => {
    const prevCssSize = useRef(undefined);
    const windowSizeCallback = useCallback((size) => {
        prevCssSize.current?.(); // cleanup prev
        prevCssSize.current = createCssSize(size, options);
    }, [prevCssSize, options]);
    useWindowSize(windowSizeCallback, { ...defaultWindowSizeOptions, ...options });
    useIsomorphicLayoutEffect(() => {
        // cleanups:
        return () => {
            prevCssSize.current?.(); // cleanup prev
            prevCssSize.current = undefined;
        };
    }, []); // runs once
};
export function UseWindowCssSize(props) {
    // hooks:
    useWindowCssSize(props);
    // jsx:
    return React.createElement(React.Fragment, null);
}
