// react:
import {
    default as React,
    useRef,
    useCallback,
}                           from 'react'         // base technology of our nodestrap components

// cssfn:
import type {
    Cust,
}                           from '@cssfn/css-types'   // ts defs support for cssfn
import {
    // styles:
    createSheet,
    
    
    // compositions:
    globalDef,
    vars,
    
    
    // rules:
    atRoot,
}                           from '@cssfn/cssfn'       // cssfn core

// nodestrap utilities:
import {
    useIsomorphicLayoutEffect, // TODO: replace with useInsertionEffect
}                           from '@nodestrap/hooks'



// types:

export type BoxOptions = 'border-box' | 'content-box'
export interface SizeOptions {
    box: BoxOptions
}
const defaultElementSizeOptions : SizeOptions = { box: 'border-box'  };
const defaultWindowSizeOptions  : SizeOptions = { box: 'content-box' };

export type Size        = { width: number, height: number }
export type Nullable<T> = { [key in keyof T] : T[key] | null }



// utilities:
const createCssSize = (size: Readonly<Nullable<Size>>, options: CssSizeOptions) => {
    const { width   , height    } = size;
    const { varWidth, varHeight } = options;
    
    
    
    // conditions:
    const hasWidth  = ((width  !== null) && !!varWidth );
    const hasHeight = ((height !== null) && !!varHeight);
    if (!hasWidth && !hasHeight) return; // nothing to update
    
    
    
    // setups:
    const sheet = createSheet(() => [
        globalDef([
            atRoot([
                hasWidth  && vars({
                    [varWidth  as string] : `${width}px`,
                }),
                hasHeight && vars({
                    [varHeight as string] : `${height}px`,
                }),
            ]),
        ]),
    ])
    .attach()
    ;
    
    
    
    // cleanups:
    return () => {
        sheet.detach();
    };
};



// hooks:

export type ElementResizeCallback<TElement extends HTMLElement = HTMLElement> = (elm: TElement) => void
export const useElementOnResize = <TElement extends HTMLElement = HTMLElement>(resizingElementRef: React.RefObject<TElement>, elementResizeCallback: ElementResizeCallback<TElement>, options = defaultElementSizeOptions) => {
    // dom effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const resizingElement = resizingElementRef.current;
        if (!resizingElement) return;
        
        
        
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

export type ElementSizeCallback<TElement extends HTMLElement = HTMLElement> = (size: Size, elm: TElement) => void
export const useElementSize = <TElement extends HTMLElement = HTMLElement>(resizingElementRef: React.RefObject<TElement>, elementSizeCallback: ElementSizeCallback, options = defaultElementSizeOptions) => {
    const isBorderBox = (options.box === 'border-box');
    const elementResizeCallback : ElementResizeCallback = useCallback((elm) => {
        elementSizeCallback({
            width  : (isBorderBox ? elm.offsetWidth  : elm.clientWidth ),
            height : (isBorderBox ? elm.offsetHeight : elm.clientHeight),
        }, elm);
    }, [isBorderBox, elementSizeCallback]);
    useElementOnResize<TElement>(resizingElementRef, elementResizeCallback, options);
};

export interface CssSizeOptions extends Partial<SizeOptions> {
    varWidth  ?: Cust.Decl
    varHeight ?: Cust.Decl
}
export const useElementCssSize = <TElement extends HTMLElement = HTMLElement>(resizingElementRef: React.RefObject<TElement>, options: CssSizeOptions) => {
    const prevCssSize = useRef<(() => void)|undefined>(undefined);
    const elementSizeCallback : ElementSizeCallback = useCallback((size) => {
        prevCssSize.current?.(); // cleanup prev
        prevCssSize.current = createCssSize(size, options);
    }, [prevCssSize, options]);
    useElementSize(resizingElementRef, elementSizeCallback, {...defaultElementSizeOptions, ...options});
    
    useIsomorphicLayoutEffect(() => {
        // cleanups:
        return () => {
            prevCssSize.current?.(); // cleanup prev
            prevCssSize.current = undefined;
        };
    }, []); // runs once
};



export type WindowResizeCallback = (window: Window) => void
export const useWindowOnResize = (windowResizeCallback: WindowResizeCallback) => {
    // dom effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (typeof(window) === 'undefined') return;
        
        
        
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

export type WindowSizeCallback = (size: Size, window: Window) => void
export const useWindowSize = (windowSizeCallback : WindowSizeCallback, options = defaultWindowSizeOptions) => {
    const isBorderBox = (options.box === 'border-box');
    const windowResizeCallback : WindowResizeCallback = useCallback((window) => {
        windowSizeCallback({
            width  : (isBorderBox ? window.outerWidth  : window.innerWidth ),
            height : (isBorderBox ? window.outerHeight : window.innerHeight),
        }, window);
    }, [isBorderBox, windowSizeCallback]);
    useWindowOnResize(windowResizeCallback);
};

export const useWindowCssSize = (options: CssSizeOptions) => {
    const prevCssSize = useRef<(() => void)|undefined>(undefined);
    const windowSizeCallback : WindowSizeCallback = useCallback((size) => {
        prevCssSize.current?.(); // cleanup prev
        prevCssSize.current = createCssSize(size, options);
    }, [prevCssSize, options]);
    useWindowSize(windowSizeCallback, {...defaultWindowSizeOptions, ...options});
    
    useIsomorphicLayoutEffect(() => {
        // cleanups:
        return () => {
            prevCssSize.current?.(); // cleanup prev
            prevCssSize.current = undefined;
        };
    }, []); // runs once
};



export function UseWindowCssSize(props: CssSizeOptions) {
    // hooks:
    useWindowCssSize(props);
    
    
    
    // jsx:
    return <></>;
}
