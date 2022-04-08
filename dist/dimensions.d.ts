import { default as React } from 'react';
import type { Cust } from '@cssfn/css-types';
export declare type BoxOptions = 'border-box' | 'content-box';
export interface SizeOptions {
    box: BoxOptions;
}
export declare type Size = {
    width: number;
    height: number;
};
export declare type Nullable<T> = {
    [key in keyof T]: T[key] | null;
};
export declare type ElementResizeCallback<TElement extends HTMLElement = HTMLElement> = (elm: TElement) => void;
export declare const useElementOnResize: <TElement extends HTMLElement = HTMLElement>(resizingElementRef: React.RefObject<TElement>, elementResizeCallback: ElementResizeCallback<TElement>, options?: SizeOptions) => void;
export declare type ElementSizeCallback<TElement extends HTMLElement = HTMLElement> = (size: Size, elm: TElement) => void;
export declare const useElementSize: <TElement extends HTMLElement = HTMLElement>(resizingElementRef: React.RefObject<TElement>, elementSizeCallback: ElementSizeCallback, options?: SizeOptions) => void;
export interface CssSizeOptions extends Partial<SizeOptions> {
    varWidth?: Cust.Decl;
    varHeight?: Cust.Decl;
}
export declare const useElementCssSize: <TElement extends HTMLElement = HTMLElement>(resizingElementRef: React.RefObject<TElement>, options: CssSizeOptions) => void;
export declare type WindowResizeCallback = (window: Window) => void;
export declare const useWindowOnResize: (windowResizeCallback: WindowResizeCallback) => void;
export declare type WindowSizeCallback = (size: Size, window: Window) => void;
export declare const useWindowSize: (windowSizeCallback: WindowSizeCallback, options?: SizeOptions) => void;
export declare const useWindowCssSize: (options: CssSizeOptions) => void;
export declare function UseWindowCssSize(props: CssSizeOptions): JSX.Element;
