import { LayoutSystem } from '../Layout';
import { PixiTextStyle } from '../utils/text';
import type { ConditionalStyles, GradeToOne, Styles } from '../utils/types';
/** Style controller manages {@link LayoutSystem} styles. */
export declare class StyleController {
    protected layout: LayoutSystem;
    protected styles: Styles;
    /** Holds all text related styles. This is to be nested by children */
    protected _textStyle: Partial<PixiTextStyle>;
    /** Stores default styles. */
    protected defaultStyles: Styles;
    /** Conditional styles */
    protected conditionalStyles: ConditionalStyles;
    /**
     * Manages and sets all the styles of {@link LayoutSystem}
     * @param layout - {@link LayoutSystem} to be styled
     * @param styles - styles to be applied
     */
    constructor(layout: LayoutSystem, styles?: Styles);
    /**
     * Applies a list of styles for the layout.
     * @param { Styles } styles - styles to be applied
     */
    set(styles?: Styles & ConditionalStyles): void;
    /**
     * Returns a style value by name.
     * @param style - name of the style
     */
    get(style: keyof Styles): Styles[keyof Styles];
    /** Returns all styles of the Layout */
    getAll(): Styles;
    /** Returns all pixi text related styles of the Layout */
    get textStyle(): Partial<PixiTextStyle>;
    /** Sets the opacity of the layout */
    set opacity(value: GradeToOne);
    /** Returns the opacity of the layout */
    get opacity(): GradeToOne;
    /** Set visibility of the layout */
    set visible(value: boolean);
    /** Returns visibility of the layout */
    get visible(): boolean;
    /** Checks and applies conditional styles basing on parent size */
    applyConditionalStyles(): void;
    /**
     * Separates conditional styles from default styles
     * @param styles - mixed styles
     */
    protected separateConditionalStyles(styles?: Styles & ConditionalStyles): void;
    /** Returns true if there are conditional styles */
    get hasConditionalStyles(): boolean;
}
//# sourceMappingURL=StyleController.d.ts.map