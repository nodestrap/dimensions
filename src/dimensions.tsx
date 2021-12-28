// react:
import {
    default as React,
    useRef,
    useReducer as _useReducer,
}                           from 'react'         // base technology of our nodestrap components

// cssfn:
import type {
    Cust,
}                           from '@cssfn/css-types'   // ts defs support for cssfn
import {
    // general types:
    StyleSheet,
    
    
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
    useIsomorphicLayoutEffect,
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
export type Mutable<T>  = { -readonly [key in keyof T] : T[key] }



// internal hooks:
const reducerHandler = (size: Nullable<Size>, newSize: Size): Nullable<Size> => {
    if ((newSize.width === size.width) && (newSize.height === size.height)) return size; // no diff => no changes needed
    
    return newSize;
};
const useSizeState = (initial?: () => Size|null) => !initial ? _useReducer(reducerHandler, { width: null, height: null }) : _useReducer(reducerHandler, { width: null, height: null }, () => initial() ?? { width: null, height: null });

const useCssSize = (size: Readonly<Nullable<Size>>, options: CssSizeOptions) => {
    const { varWidth, varHeight } = options;
    const sheet = useRef<StyleSheet | null>(null);
    
    useIsomorphicLayoutEffect(() => {
        const { width, height } = size;
        const hasWidth  = ((width  !== null) && varWidth );
        const hasHeight = ((height !== null) && varHeight)
        if (!hasWidth && !hasHeight) return;
        
        
        
        // setups:
        sheet.current = createSheet(() => [
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
        ]);
        
        
        
        // cleanups:
        return () => {
            sheet.current?.detach();
        };
    }, [size, varWidth, varHeight]);
};



// hooks:

export type OnElementResizeCallback = (elm: HTMLElement) => void
export const useElementOnResize = (callback: OnElementResizeCallback, options = defaultElementSizeOptions) => {
    const elmRef = useRef<HTMLElement>(null);
    
    
    
    useIsomorphicLayoutEffect(() => {
        const elm = elmRef.current;
        if (!elm) return;
        
        
        
        // handlers:
        const handleResize = () => {
            callback(elm);
        }
        
        
        
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
            width  : (isBorderBox ? elm.offsetWidth  : elm.clientWidth ),
            height : (isBorderBox ? elm.offsetHeight : elm.clientHeight),
        });
    }, options);
    
    
    
    return [size, elmRef] as const;
};

export interface CssSizeOptions extends Partial<SizeOptions> {
    varWidth  ?: Cust.Decl
    varHeight ?: Cust.Decl
}
export const useElementCssSize = (options: CssSizeOptions) => {
    const [size, setElmRef] = useElementSize({...defaultElementSizeOptions, ...options});
    useCssSize(size, options);
    
    
    
    return setElmRef;
};



export type OnWindowResizeCallback = (window: Window) => void
export const useWindowOnResize = (callback: OnWindowResizeCallback) => {
    useIsomorphicLayoutEffect(() => {
        if (typeof(window) === 'undefined') return;
        
        
        
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
    
    const [size, setSize] = useSizeState((): Size|null => {
        if (typeof(window) === 'undefined') return null;
        
        return {
            width  : (isBorderBox ? window.outerWidth  : window.innerWidth ),
            height : (isBorderBox ? window.outerHeight : window.innerHeight),
        };
    });
    
    
    
    useWindowOnResize((window) => {
        setSize({
            width  : (isBorderBox ? window.outerWidth  : window.innerWidth ),
            height : (isBorderBox ? window.outerHeight : window.innerHeight),
        });
    });
    
    
    
    return size;
};

export const useWindowCssSize = (options: CssSizeOptions) => {
    const size = useWindowSize({...defaultWindowSizeOptions, ...options});
    useCssSize(size, options);
};



export interface UseWindowCssSizeProps {
    options: CssSizeOptions
}
export function UseWindowCssSize(props: UseWindowCssSizeProps) {
    // hooks:
    useWindowCssSize(props.options);
    
    
    
    // jsx:
    return <></>;
}
