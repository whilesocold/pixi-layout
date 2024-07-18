import { LayoutSystem } from '../Layout';
import { PixiTextStyle } from './text';
import { FlexNumber, Styles } from './types';
export declare function rgba2Hex([r, g, b]: number[]): number;
export declare function getHex(n: number): string;
export declare function isDefined(value: any): boolean;
export declare function getNumber(value: FlexNumber, maxPercentValue?: number): number;
export declare function stylesToPixiTextStyles(styles: Styles): PixiTextStyle;
/**
 * Detect if layout is just a wrapper for a text element.
 * @param {LayoutSystem} layout - Layout to check.
 */
export declare function isItJustAText(layout: LayoutSystem): boolean;
//# sourceMappingURL=helpers.d.ts.map