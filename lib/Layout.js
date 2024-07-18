'use strict';

var pixi_js = require('pixi.js');
var AlignController = require('./controllers/AlignController.js');
var ContentController = require('./controllers/ContentController.js');
var SizeController = require('./controllers/SizeController.js');
var StyleController = require('./controllers/StyleController.js');

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class LayoutSystem {
  /**
   * Creates layout system instance.
   * @param options - Layout options
   * @param options.id - ID of the layout.
   * @param options.styles - Styles of the layout. List of available styles can be found in {@link StyleController}.
   * @param options.content - Content of the layout.
   * @param options.globalStyles - Global styles for layout and it's children.
   * @param container - Container for all layout children, will be created if not provided.
   */
  constructor(options, container) {
    /** Container for all layout children. */
    __publicField(this, "container");
    /** ID of layout, can be used to set styles in the globalStyles object somewhere higher in hierarchal tree. */
    __publicField(this, "id");
    /** {@link SizeController} is a class for controlling layout and all it's children sizes. */
    __publicField(this, "size");
    /** {@link AlignController} is a class for controlling layout and all it's children alignment. */
    __publicField(this, "align");
    /** {@link StyleController} is a class for controlling styles. */
    __publicField(this, "_style");
    /** {@link ContentController} controller is a class for controlling layouts children. */
    __publicField(this, "content");
    /** Stores isPortrait state */
    __publicField(this, "isPortrait");
    this.container = container || new pixi_js.Container();
    this.id = options?.id;
    if (options?.globalStyles) {
      const styles = options.globalStyles[this.id];
      if (styles && options.styles) {
        options.styles = { ...styles, ...options.styles };
      } else if (styles) {
        options.styles = styles;
      }
    }
    this.size = new SizeController.SizeController(this);
    this._style = new StyleController.StyleController(this, options?.styles);
    this.align = new AlignController.AlignController(this);
    this.content = new ContentController.ContentController(
      this,
      options?.content,
      options?.globalStyles
    );
  }
  /**
   * Resize method should be called on every parent size change.
   * @param parentWidth
   * @param parentHeight
   */
  resize(parentWidth, parentHeight) {
    const width = parentWidth || this.contentWidth || this.size.parentWidth;
    const height = parentHeight || this.contentHeight || this.size.parentHeight;
    this.isPortrait = width < height;
    this._style.applyConditionalStyles();
    this.size.resize(parentWidth, parentHeight);
  }
  /** Recalculate positions and sizes of layouts three. */
  refresh() {
    this.resize(this.size.parentWidth, this.size.parentHeight);
  }
  /** Returns with of the container */
  get contentWidth() {
    if (!this.container?.parent) {
      return void 0;
    }
    return this.container.parent.width;
  }
  /** Returns height of the container */
  get contentHeight() {
    if (!this.container?.parent) {
      return void 0;
    }
    return this.container.parent.height;
  }
  /** Sets the width of layout.  */
  set width(value) {
    this.size.width = value;
  }
  /** Gets the width of layout. */
  get width() {
    return this.size.width;
  }
  /** Sets the height of layout. */
  set height(value) {
    this.size.height = value;
  }
  /** Gets the height of layout. */
  get height() {
    return this.size.height;
  }
  /**
   * Adds content to the layout and reposition/resize other elements and the layout basing on styles.
   * @param {Content} content - Content to be added. Can be string, Container, Layout, LayoutOptions or array of those.
   * Also content can be an object with inner layout ids as a keys, and Content as values.
   */
  addContent(content) {
    this.content.createContent(content);
    this.updateParents();
  }
  /**
   * Removes content of the layout by its id and reposition/resize other elements and the layout basing on styles.
   * @param {string} id - id of the content to be removed.
   */
  removeChildByID(id) {
    this.content.removeContent(id);
  }
  /**
   * Get element from the layout child tree by it's ID
   * @param {string} id - id of the content to be foundS.
   */
  getChildByID(id) {
    return this.content.getByID(id);
  }
  /**
   * This is used in case if layout or some of it's children was changed
   * and we need to update sizes and positions for all the parents tree.
   */
  updateParents() {
    const rootLayout = this.getRootLayout();
    rootLayout.size.resize();
  }
  /** Returns root layout of the layout tree. */
  getRootLayout() {
    if (this.container.parent?.layout) {
      return this.container.parent.layout.getRootLayout();
    }
    return this;
  }
  /**
   * Updates the layout styles and resize/reposition it and its children basing on new styles.
   * @param styles
   */
  setStyles(styles) {
    this._style.set(styles);
    this.updateParents();
  }
  /** Layout text styles. */
  get textStyle() {
    return this._style.textStyle;
  }
  /** Layout styles. */
  get style() {
    return this._style.getAll();
  }
  /** Returns true if root layout is in landscape mode. */
  get isRootLayoutPortrait() {
    return this.getRootLayout().isPortrait === true;
  }
}
class Layout extends pixi_js.Container {
  /**
   * Creates layout container.
   * @param options
   */
  constructor(options) {
    super();
    __publicField(this, "layout");
    this.layout = new LayoutSystem(options, this);
  }
  /** Get {@link SizeController} */
  get size() {
    return this.layout.size;
  }
  /** {@link AlignController} */
  get align() {
    return this.layout.align;
  }
  /** {@link ContentController} */
  get content() {
    return this.layout.content;
  }
  /** ID of layout, can be used to set styles in the globalStyles. */
  get id() {
    return this.layout.id;
  }
  /** ID of layout, can be used to set styles in the globalStyles. */
  set id(value) {
    this.layout.id = value;
  }
  /** Returns with of the layouts content. */
  get contentWidth() {
    if (!this.layout) {
      return 0;
    }
    return this.layout.contentWidth;
  }
  /** Returns height of the layouts content. */
  get contentHeight() {
    if (!this.layout) {
      return 0;
    }
    return this.layout.contentHeight;
  }
  /** Set the width of layout.  */
  set width(value) {
    if (!this.layout) {
      return;
    }
    this.layout.width = value;
  }
  /** Get the width of layout. */
  get width() {
    if (!this.layout) {
      return 0;
    }
    return this.layout.width;
  }
  /** Set the height of layout. */
  set height(value) {
    if (!this.layout) {
      return;
    }
    this.layout.height = value;
  }
  /** Get the height of layout. */
  get height() {
    if (!this.layout) {
      return 0;
    }
    return this.layout.height;
  }
  /**
   * Add content to the layout system and reposition/resize elements basing on styles.
   * @param {Content} content - Content to be added. Can be string, Container, Layout, LayoutOptions or array of those.
   * Also content can be an object where keys are ids of child layouts to create, and Content as values.
   */
  addContent(content) {
    this.layout.addContent(content);
  }
  /**
   * Remove content from layout system by its id and reposition/resize elements basing on styles.
   * @param {string} id - id of the content to be removed.
   */
  removeChildByID(id) {
    this.layout.removeChildByID(id);
  }
  /**
   * Get element from the layout system children tree by it's ID
   * @param {string} id - id of the content to be foundS.
   */
  getChildByID(id) {
    return this.layout.getChildByID(id);
  }
  /**
   * Updates the layout styles and resize/reposition elements basing on new styles.
   * @param styles
   */
  setStyles(styles) {
    this.layout.setStyles(styles);
  }
  /** Layout text styles. */
  get textStyle() {
    return this.layout.textStyle;
  }
  /** Layout styles. */
  get style() {
    return this.layout.style;
  }
  /**
   * Resize method should be called on every parent size change.
   * @param parentWidth
   * @param parentHeight
   */
  resize(parentWidth, parentHeight) {
    this.layout.resize(parentWidth, parentHeight);
  }
  /** Recalculate positions and sizes of layouts three. */
  refresh() {
    this.resize(this.size.parentWidth, this.size.parentHeight);
  }
}
if (!pixi_js.Container.prototype.initLayout) {
  Object.defineProperty(pixi_js.Container.prototype, "initLayout", {
    value(options) {
      if (!this.layout) {
        this.layout = new LayoutSystem(options, this);
        this.isPixiLayout = true;
      }
      return this;
    }
  });
}

exports.Layout = Layout;
exports.LayoutSystem = LayoutSystem;
//# sourceMappingURL=Layout.js.map
