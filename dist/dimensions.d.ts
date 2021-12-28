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
export declare type Mutable<T> = {
    -readonly [key in keyof T]: T[key];
};
export declare type OnElementResizeCallback = (elm: HTMLElement) => void;
export declare const useElementOnResize: (callback: OnElementResizeCallback, options?: SizeOptions) => React.RefObject<HTMLElement>;
export declare const useElementSize: (options?: SizeOptions) => readonly [Nullable<Size>, React.RefObject<HTMLElement>];
export interface CssSizeOptions extends Partial<SizeOptions> {
    varWidth?: Cust.Decl;
    varHeight?: Cust.Decl;
}
export declare const useElementCssSize: (options: CssSizeOptions) => React.RefObject<HTMLElement>;
export declare type OnWindowResizeCallback = (window: Window) => void;
export declare const useWindowOnResize: (callback: OnWindowResizeCallback) => void;
export declare const useWindowSize: (options?: SizeOptions) => Nullable<Size>;
export declare const useWindowCssSize: (options: CssSizeOptions) => void;
export interface UseWindowCssSizeProps {
    options: CssSizeOptions;
}
export declare function UseWindowCssSize(props: UseWindowCssSizeProps): JSX.Element;
