import { Container } from 'pixi.js';
import { AlignController } from './controllers/AlignController';
import { ContentController } from './controllers/ContentController';
import { SizeController } from './controllers/SizeController';
import { StyleController } from './controllers/StyleController';
import { PixiTextStyle } from './utils/text';
import { ConditionalStyles, Content, LayoutOptions, Styles } from './utils/types';
/**
 * Layout controller class for any PixiJS Container based instance.
 *
 * To be be used for automatic align and resize children tree,
 * where every child behavior can be configured using css like configurations.
 *
 * Also it adds a list of css-like properties for styling like background style or text style,
 * check {@link SizeController} class.
 *
 * Any PixiJS Container based instance can be turned into a layout by calling {@link Layout#initLayout} method.
 * @example
 * const container = new Container().initLayout();
 *
 * container.layout?.setStyles({
 *      background: 'black',
 *      width: '100%',
 *      height: '100%',
 *      padding: 10,
 *      overflow: 'hidden',
 *      color: 'white',
 * }); // set styles
 *
 * container.layout?.setContent({
 *      text: 'Hello World',
 * }); // set content
 *
 * Or alternatively:
 *
 * const layoutSystem = new LayoutSystem({
 *      id: 'root',
 *      content: 'Hello World',
 *      styles: {
 *          background: 'black',
 *      }
 * }); // create layout system
 *
 * app.stage.addChild(layoutSystem.container); // add layout system generated container to the stage
 */
export declare class LayoutSystem {
    /** Container for all layout children. */
    container: Container;
    /** ID of layout, can be used to set styles in the globalStyles object somewhere higher in hierarchal tree. */
    id: string;
    /** {@link SizeController} is a class for controlling layout and all it's children sizes. */
    size: SizeController;
    /** {@link AlignController} is a class for controlling layout and all it's children alignment. */
    align: AlignController;
    /** {@link StyleController} is a class for controlling styles. */
    protected _style: StyleController;
    /** {@link ContentController} controller is a class for controlling layouts children. */
    content: ContentController;
    /** Stores isPortrait state */
    isPortrait: boolean;
    /**
     * Creates layout system instance.
     * @param options - Layout options
     * @param options.id - ID of the layout.
     * @param options.styles - Styles of the layout. List of available styles can be found in {@link StyleController}.
     * @param options.content - Content of the layout.
     * @param options.globalStyles - Global styles for layout and it's children.
     * @param container - Container for all layout children, will be created if not provided.
     */
    constructor(options?: LayoutOptions, container?: Container);
    /**
     * Resize method should be called on every parent size change.
     * @param parentWidth
     * @param parentHeight
     */
    resize(parentWidth?: number, parentHeight?: number): void;
    /** Recalculate positions and sizes of layouts three. */
    refresh(): void;
    /** Returns with of the container */
    get contentWidth(): number | undefined;
    /** Returns height of the container */
    get contentHeight(): number | undefined;
    /** Sets the width of layout.  */
    set width(value: number);
    /** Gets the width of layout. */
    get width(): number;
    /** Sets the height of layout. */
    set height(value: number);
    /** Gets the height of layout. */
    get height(): number;
    /**
     * Adds content to the layout and reposition/resize other elements and the layout basing on styles.
     * @param {Content} content - Content to be added. Can be string, Container, Layout, LayoutOptions or array of those.
     * Also content can be an object with inner layout ids as a keys, and Content as values.
     */
    addContent(content: Content): void;
    /**
     * Removes content of the layout by its id and reposition/resize other elements and the layout basing on styles.
     * @param {string} id - id of the content to be removed.
     */
    removeChildByID(id: string): void;
    /**
     * Get element from the layout child tree by it's ID
     * @param {string} id - id of the content to be foundS.
     */
    getChildByID(id: string): Layout | Container | undefined;
    /**
     * This is used in case if layout or some of it's children was changed
     * and we need to update sizes and positions for all the parents tree.
     */
    updateParents(): void;
    /** Returns root layout of the layout tree. */
    getRootLayout(): LayoutSystem;
    /**
     * Updates the layout styles and resize/reposition it and its children basing on new styles.
     * @param styles
     */
    setStyles(styles: Styles & ConditionalStyles): void;
    /** Layout text styles. */
    get textStyle(): Partial<PixiTextStyle>;
    /** Layout styles. */
    get style(): Styles;
    /** Returns true if root layout is in landscape mode. */
    get isRootLayoutPortrait(): boolean;
}
/**
 * Container with layout system initiated.
 * @example
 *
 * const layout = new Layout({
 * 	styles: {
 * 		width: 100,
 * 		height: 100,
 * 		background: 'red',
 * 	},
 * 	content: [
 * 		'Hello world',
 * 		{
 * 			id: 'innerLayout1',
 * 			text: 'Inner layout 1',
 * 		},
 * 		{
 * 			id: 'innerLayout2',
 * 			text: 'Inner layout 2',
 * 		},
 * 	],
 * 	globalStyles: {
 * 		innerLayout1: {
 * 			width: 200,
 * 			height: 200,
 * 		},
 * 		innerLayout1: {
 * 			width: 200,
 * 			height: 200,
 * 		},
 * 	},
 * });
 */
export declare class Layout extends Container {
    layout: LayoutSystem;
    /**
     * Creates layout container.
     * @param options
     */
    constructor(options?: LayoutOptions);
    /** Get {@link SizeController} */
    get size(): SizeController;
    /** {@link AlignController} */
    get align(): AlignController;
    /** {@link ContentController} */
    get content(): ContentController;
    /** ID of layout, can be used to set styles in the globalStyles. */
    get id(): string;
    /** ID of layout, can be used to set styles in the globalStyles. */
    set id(value: string);
    /** Returns with of the layouts content. */
    get contentWidth(): number | undefined;
    /** Returns height of the layouts content. */
    get contentHeight(): number | undefined;
    /** Set the width of layout.  */
    set width(value: number);
    /** Get the width of layout. */
    get width(): number;
    /** Set the height of layout. */
    set height(value: number);
    /** Get the height of layout. */
    get height(): number;
    /**
     * Add content to the layout system and reposition/resize elements basing on styles.
     * @param {Content} content - Content to be added. Can be string, Container, Layout, LayoutOptions or array of those.
     * Also content can be an object where keys are ids of child layouts to create, and Content as values.
     */
    addContent(content: Content): void;
    /**
     * Remove content from layout system by its id and reposition/resize elements basing on styles.
     * @param {string} id - id of the content to be removed.
     */
    removeChildByID(id: string): void;
    /**
     * Get element from the layout system children tree by it's ID
     * @param {string} id - id of the content to be foundS.
     */
    getChildByID(id: string): Layout | Container | undefined;
    /**
     * Updates the layout styles and resize/reposition elements basing on new styles.
     * @param styles
     */
    setStyles(styles: Styles): void;
    /** Layout text styles. */
    get textStyle(): Partial<PixiTextStyle>;
    /** Layout styles. */
    get style(): Styles;
    /**
     * Resize method should be called on every parent size change.
     * @param parentWidth
     * @param parentHeight
     */
    resize(parentWidth?: number, parentHeight?: number): void;
    /** Recalculate positions and sizes of layouts three. */
    refresh(): void;
}
declare module 'pixi.js' {
    interface Container {
        initLayout(config?: LayoutOptions): Container;
        layout?: LayoutSystem;
        isPixiLayout?: boolean;
    }
}
//# sourceMappingURL=Layout.d.ts.map