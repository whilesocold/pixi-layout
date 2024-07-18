'use strict';

var pixi_js = require('pixi.js');
var constants = require('../utils/constants.js');
var helpers = require('../utils/helpers.js');

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class StyleController {
  /**
   * Manages and sets all the styles of {@link LayoutSystem}
   * @param layout - {@link LayoutSystem} to be styled
   * @param styles - styles to be applied
   */
  constructor(layout, styles) {
    __publicField(this, "layout");
    __publicField(this, "styles", {});
    /** Holds all text related styles. This is to be nested by children */
    __publicField(this, "_textStyle", {});
    // this is to be nested by children
    /** Stores default styles. */
    __publicField(this, "defaultStyles");
    /** Conditional styles */
    __publicField(this, "conditionalStyles", {});
    this.layout = layout;
    this.set(styles);
  }
  /**
   * Applies a list of styles for the layout.
   * @param { Styles } styles - styles to be applied
   */
  set(styles) {
    this.styles.overflow = styles?.overflow ?? this.styles.overflow ?? constants.OVERFLOW[0];
    this.styles.display = styles?.display ?? this.styles.display ?? "inline-block";
    this.styles.borderRadius = styles?.borderRadius ?? this.styles.borderRadius ?? 0;
    this.styles.zIndex = styles?.zIndex ?? this.styles.zIndex ?? 1;
    this.opacity = styles?.opacity ?? this.styles.opacity ?? 1;
    this.styles.maxWidth = styles?.maxWidth ?? this.styles.maxWidth;
    this.styles.maxHeight = styles?.maxHeight ?? this.styles.maxHeight;
    this.styles.minWidth = styles?.minWidth ?? this.styles.minWidth;
    this.styles.minHeight = styles?.minHeight ?? this.styles.minHeight;
    this.styles.padding = styles?.padding ?? this.styles.padding ?? 0;
    this.styles.paddingTop = styles?.paddingTop ?? styles?.padding ?? this.styles.paddingTop ?? 0;
    this.styles.paddingRight = styles?.paddingRight ?? styles?.padding ?? this.styles.paddingRight ?? 0;
    this.styles.paddingBottom = styles?.paddingBottom ?? styles?.padding ?? this.styles.paddingBottom ?? 0;
    this.styles.paddingLeft = styles?.paddingLeft ?? styles?.padding ?? this.styles.paddingLeft ?? 0;
    this.styles.margin = styles?.margin ?? this.styles.margin ?? 0;
    this.styles.marginTop = styles?.marginTop ?? styles?.margin ?? this.styles.marginTop ?? 0;
    this.styles.marginRight = styles?.marginRight ?? styles?.margin ?? this.styles.marginRight ?? 0;
    this.styles.marginBottom = styles?.marginBottom ?? styles?.margin ?? this.styles.marginBottom ?? 0;
    this.styles.marginLeft = styles?.marginLeft ?? styles?.margin ?? this.styles.marginLeft ?? 0;
    this.styles.scale = styles?.scale ?? this.styles.scale ?? 1;
    this.styles.scaleX = styles?.scaleX ?? styles?.scale ?? this.styles.scaleX ?? 1;
    this.styles.scaleY = styles?.scaleY ?? styles?.scale ?? this.styles.scaleY ?? 1;
    this.styles.width = styles?.width ?? this.styles.width ?? "auto";
    this.styles.height = styles?.height ?? this.styles.height ?? "auto";
    this.styles.wordWrap = styles?.wordWrap ?? false;
    if (styles?.anchorX !== void 0) {
      this.styles.anchorX = styles.anchorX;
    } else if (styles?.anchor !== void 0) {
      if (typeof styles.anchor === "number") {
        this.styles.anchorX = styles.anchor;
      } else if (Array.isArray(styles.anchor)) {
        this.styles.anchorX = styles.anchor[0];
      }
    }
    if (styles?.anchorY !== void 0) {
      this.styles.anchorY = styles.anchorY;
    } else if (styles?.anchor !== void 0) {
      if (typeof styles.anchor === "number") {
        this.styles.anchorY = styles.anchor;
      } else if (Array.isArray(styles.anchor) && styles.anchor[1] !== void 0) {
        this.styles.anchorY = styles.anchor[1];
      }
    }
    this.styles.background = styles?.background ?? styles?.backgroundColor ?? this.styles.background;
    this.styles.backgroundSize = styles?.backgroundSize ?? this.styles.backgroundSize ?? constants.BACKGROUND_SIZE[0];
    if (this.styles.background instanceof pixi_js.NineSliceSprite || this.styles.background instanceof pixi_js.TilingSprite) {
      this.styles.backgroundSize = "stretch";
    }
    this.styles.textAlign = styles?.textAlign ?? this.styles.textAlign;
    this.styles.position = styles?.position ?? this.styles.position;
    this.styles.verticalAlign = styles?.verticalAlign ?? this.styles.verticalAlign ?? constants.VERTICAL_ALIGN[0];
    this.styles.aspectRatio = styles?.aspectRatio ?? this.styles.aspectRatio ?? "static";
    this.styles.visible = styles?.visible ?? this.styles.visible ?? true;
    this.visible = this.styles.visible;
    this._textStyle = helpers.stylesToPixiTextStyles(styles);
    if (styles) {
      this.separateConditionalStyles(styles);
    }
  }
  /**
   * Returns a style value by name.
   * @param style - name of the style
   */
  get(style) {
    return this.styles[style];
  }
  /** Returns all styles of the Layout */
  getAll() {
    return this.styles;
  }
  /** Returns all pixi text related styles of the Layout */
  get textStyle() {
    return this._textStyle;
  }
  /** Sets the opacity of the layout */
  set opacity(value) {
    this.styles.opacity = value;
    this.layout.container.alpha = value;
  }
  /** Returns the opacity of the layout */
  get opacity() {
    return this.styles.opacity;
  }
  /** Set visibility of the layout */
  set visible(value) {
    this.layout.container.visible = value;
  }
  /** Returns visibility of the layout */
  get visible() {
    return this.layout.container.visible;
  }
  /** Checks and applies conditional styles basing on parent size */
  applyConditionalStyles() {
    if (!this.hasConditionalStyles)
      return;
    this.set({
      ...this.defaultStyles,
      ...this.layout.isRootLayoutPortrait ? this.conditionalStyles.portrait : this.conditionalStyles.landscape
    });
  }
  /**
   * Separates conditional styles from default styles
   * @param styles - mixed styles
   */
  separateConditionalStyles(styles) {
    if (!styles.portrait && !styles.landscape) {
      this.defaultStyles = {
        ...styles
      };
      return;
    }
    if (styles.portrait) {
      this.conditionalStyles.portrait = {
        ...this.conditionalStyles.portrait,
        ...styles.portrait
      };
    }
    if (styles.landscape) {
      this.conditionalStyles.landscape = {
        ...this.conditionalStyles.landscape,
        ...styles.landscape
      };
    }
    delete styles.portrait;
    delete styles.landscape;
    this.defaultStyles = styles;
  }
  /** Returns true if there are conditional styles */
  get hasConditionalStyles() {
    return Object.keys(this.conditionalStyles).length > 0;
  }
}

exports.StyleController = StyleController;
//# sourceMappingURL=StyleController.js.map
