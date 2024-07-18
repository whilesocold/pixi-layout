import { Container } from 'pixi.js';
import { LayoutSystem } from '../Layout';
import { Content, ContentType, LayoutStyles } from '../utils/types';
/** Controls all {@link LayoutSystem} children sizing. */
export declare class ContentController {
    protected layout: LayoutSystem;
    /**
     * List of all children of the layout, controlled by this controller.
     * As the layout is a container, you can use all container methods on it,
     * including addChild, but only elements added by layout
     * config thought constructor of {@link ContentController} or using
     * `addContent` method will be managed by this controller.
     */
    children: Map<string, Container>;
    /**
     * Creates all instances and manages configs
     * @param {LayoutSystem} layout - Layout instance
     * @param content - Content of the layout
     * @param globalStyles - Global styles for layout and it's children
     */
    constructor(layout: LayoutSystem, content?: Content, globalStyles?: LayoutStyles);
    /**
     * Adds content to the layout.
     * @param {Content} content - Content of the layout
     * @param {LayoutStyles} parentGlobalStyles - Global styles for layout and it's children
     */
    createContent(content?: Content, parentGlobalStyles?: LayoutStyles): void;
    /**
     * Adds content element to the layout and register it in Content controller registry.
     * @param {string} id - ID of the element.
     * @param {Container } content - pixi container instance to be added.
     */
    addContentElement(id: string, content: Container): void;
    /**
     * Get first child of the layout
     * @returns {Container} - First child of the layout
     */
    get firstChild(): Container;
    /**
     * Resizes all children.
     * @param width
     * @param height
     */
    resize(width: number, height: number): void;
    protected get newID(): string;
    /**
     * Get element from the layout child tree by it's ID
     * @param id
     */
    getByID(id: string): Container | undefined;
    protected getContentType(content: Content): ContentType;
    /**
     * Removes content by its id.
     * @param id
     */
    removeContent(id: string): void;
    protected onChildRemoved(child: Container): void;
    protected getChild(childInstance: Container): string | undefined;
}
//# sourceMappingURL=ContentController.d.ts.map