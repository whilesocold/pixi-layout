import { Container, Graphics, Text } from 'pixi.js';
import { LayoutSystem } from '../Layout';
import { FlexNumber, SizeControl } from '../utils/types';
/** Size controller manages {@link LayoutSystem} and it's content size. */
export declare class SizeController {
    protected layout: LayoutSystem;
    protected _width: number;
    protected _height: number;
    protected bg: Graphics | Container;
    protected overflowMask: Graphics;
    parentWidth: number;
    parentHeight: number;
    /**
     * Creates size controller.
     * @param {LayoutSystem} layout - Layout to control.
     */
    constructor(layout: LayoutSystem);
    /**
     * Updates layout size and all children sizes
     * @param {number} parentWidth - Parent width
     * @param {number} parentHeight - Parent height
     */
    resize(parentWidth?: number, parentHeight?: number): void;
    /**
     * Render and update the background of layout basing on it's current state.
     * @param finalWidth - Width of the layout.
     * @param finalHeight - Height of the layout.
     */
    protected updateBG(finalWidth: number, finalHeight: number): void;
    /** Render and update the mask of layout basing on it's current state. Mask is used to hide overflowing content. */
    protected updateMask(): void;
    protected fitInnerText(width: number, height: number): void;
    /**
     * Get type of size control basing on styles and in case if width of the layout is set to `auto`.
     * @param size - Width or height of the layout.
     */
    protected getAutoSizeModificator(size: FlexNumber | 'auto'): SizeControl;
    /**
     * Get text element if layout is just a wrapper for a text element.
     * @returns {Text} - Pixi Text element.
     */
    protected get innerText(): Text;
    /** Get width of the controlled layout. */
    get width(): number;
    /**
     * Set width of the controlled layout. And align children.
     * @param {FlexNumber} width - Width to set.
     */
    set width(width: FlexNumber);
    /** Get height of the controlled layout. */
    get height(): number;
    /**
     * Set height of the controlled layout. And align children.
     * @param {FlexNumber} height - Height to set.
     */
    set height(height: FlexNumber);
    /**
     * Fits controlled layout into parent size, scales it down if does not fit.
     *
     * This method is called when maxWidth or maxHeight is set.
     * @param parentWidth
     * @param parentHeight
     */
    protected fitToSize(parentWidth: number, parentHeight: number): void;
}
//# sourceMappingURL=SizeController.d.ts.map