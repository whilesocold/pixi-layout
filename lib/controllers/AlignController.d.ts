import { LayoutSystem } from '../Layout';
/** Align controller manages {@link LayoutSystem} and it's content alignment. */
export declare class AlignController {
    protected layout: LayoutSystem;
    /**
     * Creates align controller.
     * @param {LayoutSystem} layout - Layout to control.
     */
    constructor(layout: LayoutSystem);
    /**
     * Updates layout and all children alignments.
     * @param {number} parentWidth
     * @param {number} parentHeight
     */
    resize(parentWidth: number, parentHeight: number): void;
    protected alignChildren(parentWidth: number, parentHeight: number): void;
    protected setSelfPosition(parentWidth: number, parentHeight: number): void;
}
//# sourceMappingURL=AlignController.d.ts.map