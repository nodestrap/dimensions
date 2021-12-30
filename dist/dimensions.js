// react:
import { default as React, useRef, useReducer as _useReducer, } from 'react'; // base technology of our nodestrap components
import { 
// styles:
createSheet, 
// compositions:
globalDef, vars, 
// rules:
atRoot, } from '@cssfn/cssfn'; // cssfn core
// nodestrap utilities:
import { useIsomorphicLayoutEffect, } from '@nodestrap/hooks';
const defaultElementSizeOptions = { box: 'border-box' };
const defaultWindowSizeOptions = { box: 'content-box' };
// internal hooks:
const reducerHandler = (size, newSize) => {
    if ((newSize.width === size.width) && (newSize.height === size.height))
        return size; // no diff => no changes needed
    return newSize;
};
const useSizeState = (initial) => !initial ? _useReducer(reducerHandler, { width: null, height: null }) : _useReducer(reducerHandler, { width: null, height: null }, () => initial() ?? { width: null, height: null });
const useCssSize = (size, options) => {
    const { varWidth, varHeight } = options;
    const sheet = useRef(null);
    useIsomorphicLayoutEffect(() => {
        const { width, height } = size;
        const hasWidth = ((width !== null) && varWidth);
        const hasHeight = ((height !== null) && varHeight);
        if (!hasWidth && !hasHeight)
            return;
        // setups:
        sheet.current = createSheet(() => [
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
            sheet.current?.detach();
        };
    }, [size, varWidth, varHeight]);
};
export const useElementOnResize = (callback, options = defaultElementSizeOptions) => {
    const elmRef = useRef(null);
    useIsomorphicLayoutEffect(() => {
        const elm = elmRef.current;
        if (!elm)
            return;
        // handlers:
        const handleResize = () => {
            callback(elm);
        };
        // setups:
        const observer = new ResizeObserver(handleResize);
        observer.observe(elm, options);
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, []);
    return elmRef;
};
export const useElementSize = (options = defaultElementSizeOptions) => {
    const isBorderBox = (options.box === 'border-box');
    const [size, setSize] = useSizeState();
    const elmRef = useElementOnResize((elm) => {
        setSize({
            width: (isBorderBox ? elm.offsetWidth : elm.clientWidth),
            height: (isBorderBox ? elm.offsetHeight : elm.clientHeight),
        });
    }, options);
    return [size, elmRef];
};
export const useElementCssSize = (options) => {
    const [size, setElmRef] = useElementSize({ ...defaultElementSizeOptions, ...options });
    useCssSize(size, options);
    return setElmRef;
};
export const useWindowOnResize = (callback) => {
    useIsomorphicLayoutEffect(() => {
        if (typeof (window) === 'undefined')
            return;
        // handlers:
        const handleResize = () => {
            callback(window);
        };
        // setups:
        window.addEventListener('resize', handleResize);
        // cleanups:
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
};
export const useWindowSize = (options = defaultWindowSizeOptions) => {
    const isBorderBox = (options.box === 'border-box');
    const [size, setSize] = useSizeState(() => {
        if (typeof (window) === 'undefined')
            return null;
        return {
            width: (isBorderBox ? window.outerWidth : window.innerWidth),
            height: (isBorderBox ? window.outerHeight : window.innerHeight),
        };
    });
    useWindowOnResize((window) => {
        setSize({
            width: (isBorderBox ? window.outerWidth : window.innerWidth),
            height: (isBorderBox ? window.outerHeight : window.innerHeight),
        });
    });
    return size;
};
export const useWindowCssSize = (options) => {
    const size = useWindowSize({ ...defaultWindowSizeOptions, ...options });
    useCssSize(size, options);
};
export function UseWindowCssSize(props) {
    // hooks:
    useWindowCssSize(props.options);
    // jsx:
    return React.createElement(React.Fragment, null);
}
