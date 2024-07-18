import { Container, NineSliceSprite, TilingSprite, Sprite, Graphics } from 'pixi.js';
import { getNumber, isItJustAText } from '../utils/helpers.mjs';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class SizeController {
  /**
   * Creates size controller.
   * @param {LayoutSystem} layout - Layout to control.
   */
  constructor(layout) {
    __publicField(this, "layout");
    __publicField(this, "_width");
    __publicField(this, "_height");
    __publicField(this, "bg");
    __publicField(this, "overflowMask");
    __publicField(this, "parentWidth", 0);
    __publicField(this, "parentHeight", 0);
    this.layout = layout;
  }
  /**
   * Updates layout size and all children sizes
   * @param {number} parentWidth - Parent width
   * @param {number} parentHeight - Parent height
   */
  resize(parentWidth, parentHeight) {
    let finalWidth = 0;
    let finalHeight = 0;
    if (parentWidth !== void 0) {
      this.parentWidth = parentWidth;
    }
    if (parentHeight !== void 0) {
      this.parentHeight = parentHeight;
    }
    const {
      width,
      height,
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      scaleX,
      scaleY,
      background,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      aspectRatio
    } = this.layout.style;
    const widthModificator = this.getAutoSizeModificator(width);
    const heightModificator = this.getAutoSizeModificator(height);
    switch (widthModificator) {
      case "innerText":
        this.innerText.style.wordWrap = false;
        const parentPaddingLeft = this.layout.container.parent?.layout?.style?.paddingLeft ?? 0;
        const parentPaddingRight = this.layout.container.parent?.layout?.style?.paddingRight ?? 0;
        const paddings = paddingLeft + paddingRight + parentPaddingLeft + parentPaddingRight;
        const availableSpaceHor = this.parentWidth - paddings;
        const needToBeResized = this.innerText.width + paddings > this.parentWidth;
        if (needToBeResized) {
          this.innerText.style.wordWrap = true;
          this.innerText.style.wordWrapWidth = availableSpaceHor;
        }
        const textWidthPaddings = this.innerText.width + paddingLeft + paddingRight;
        finalWidth = textWidthPaddings;
        break;
      case "background":
        finalWidth = background.width;
        break;
      case "contentSize":
        let childrenWidth = 0;
        this.layout.content.resize(this.parentWidth, this.parentHeight);
        const { firstChild } = this.layout.content;
        if (firstChild && firstChild.layout) {
          childrenWidth += firstChild.width + firstChild.layout.style.marginLeft + firstChild.layout.style.marginRight;
        } else if (firstChild instanceof Container && firstChild.width) {
          childrenWidth += firstChild.width;
        }
        this.layout.content.children.forEach((child) => {
          if (child === firstChild) {
            return;
          }
          if (child.layout && child.layout.style.display !== "block") {
            if (child.layout.style.position) {
              return;
            }
            childrenWidth += child.width + child.layout.style.marginLeft;
          } else if (child instanceof Container && child.width) {
            childrenWidth += child.width;
          }
        });
        finalWidth = childrenWidth + paddingLeft + paddingRight;
        break;
      case "parentSize":
        finalWidth = this.parentWidth;
        break;
      case "static":
      default:
        finalWidth = getNumber(width, this.parentWidth);
        break;
    }
    switch (heightModificator) {
      case "innerText":
        finalHeight = this.innerText?.height + paddingBottom + paddingTop;
        break;
      case "background":
        finalHeight = background.height;
        break;
      case "parentSize":
        finalHeight = this.parentHeight;
        break;
      case "contentSize":
        let childrenHeight = 0;
        this.layout.content.resize(this.parentWidth, this.parentHeight);
        const { firstChild } = this.layout.content;
        if (firstChild instanceof Container && firstChild.height) {
          childrenHeight += firstChild.height;
        } else if (firstChild && firstChild.layout) {
          if (!firstChild.layout.style.position) {
            childrenHeight += firstChild.height;
          }
        }
        this.layout.content.children.forEach((child) => {
          if (child === firstChild) {
            return;
          }
          if (child.layout && child.layout.style.position) {
            return;
          }
          if (child.layout) {
            if (child.layout.style.display === "block") {
              childrenHeight += child.height;
            } else if (child.height > childrenHeight) {
              childrenHeight = child.height;
            }
          } else if (child.height > childrenHeight) {
            childrenHeight = child.height;
          }
        });
        if (isItJustAText(this.layout)) {
          finalHeight = this.innerText?.height;
        }
        finalHeight = childrenHeight + paddingTop + paddingBottom;
        break;
      case "static":
      default:
        finalHeight = getNumber(height, this.parentHeight);
        break;
    }
    if (finalWidth < 0)
      finalWidth = 0;
    if (finalHeight < 0)
      finalHeight = 0;
    this._width = finalWidth;
    this._height = finalHeight;
    this.layout.container.scale.set(scaleX, scaleY);
    if (aspectRatio === "flex" || maxWidth || maxHeight || minWidth || minHeight) {
      this.fitToSize(this.parentWidth, this.parentHeight);
    }
    this.fitInnerText(finalWidth, finalHeight);
    if (this._width === 0 || this._height === 0) {
      this.layout.container.visible = false;
      return;
    }
    this.updateBG(finalWidth, finalHeight);
    this.updateMask();
    this.layout.align.resize(this.parentWidth, this.parentHeight);
  }
  /**
   * Render and update the background of layout basing on it's current state.
   * @param finalWidth - Width of the layout.
   * @param finalHeight - Height of the layout.
   */
  updateBG(finalWidth, finalHeight) {
    const { background } = this.layout.style;
    if (background instanceof NineSliceSprite || background instanceof TilingSprite || background instanceof Sprite || background instanceof Container) {
      if (background instanceof Sprite) {
        background.anchor.set(0.5);
        background.position.set(finalWidth / 2, finalHeight / 2);
      }
      if (!this.bg) {
        this.bg = background;
        this.layout.container.addChildAt(this.bg, 0);
      }
      switch (this.layout.style.backgroundSize) {
        case "contain":
          background.scale.set(
            Math.min(
              finalWidth / background.width,
              finalHeight / background.height
            )
          );
          break;
        case "cover":
          background.scale.set(
            Math.max(
              finalWidth / background.width,
              finalHeight / background.height
            )
          );
          break;
        case "stretch":
          background.width = finalWidth;
          background.height = finalHeight;
          break;
      }
    } else {
      const color = background !== "transparent" && background;
      const { borderRadius } = this.layout.style;
      const { width, height } = this;
      if (color && width && height) {
        if (!this.bg) {
          this.bg = new Graphics();
          this.layout.container.addChildAt(this.bg, 0);
        }
        let x = 0;
        let y = 0;
        const { anchorX, anchorY } = this.layout.style;
        if (anchorX !== void 0) {
          x -= width * anchorX;
        }
        if (anchorY !== void 0) {
          y -= height * anchorY;
        }
        if (this.bg instanceof Graphics) {
          this.bg.clear().roundRect(x, y, width, height, borderRadius).fill(color);
        }
      } else if (this.bg) {
        this.layout.container.removeChild(this.bg);
        delete this.bg;
      }
    }
  }
  /** Render and update the mask of layout basing on it's current state. Mask is used to hide overflowing content. */
  updateMask() {
    const { overflow, borderRadius } = this.layout.style;
    const { width, height } = this;
    if (overflow === "hidden" && width && height) {
      if (!this.overflowMask) {
        this.overflowMask = new Graphics();
        this.layout.container.addChild(this.overflowMask);
      }
      let x = 0;
      let y = 0;
      const { anchorX, anchorY } = this.layout.style;
      if (anchorX !== void 0) {
        x -= width * anchorX;
      }
      if (anchorY !== void 0) {
        y -= height * anchorY;
      }
      this.overflowMask.clear().roundRect(x, y, width, height, borderRadius).fill(16777215);
      this.layout.container.mask = this.overflowMask;
    } else {
      this.layout.container.mask = null;
      delete this.overflowMask;
    }
  }
  fitInnerText(width, height) {
    if (!isItJustAText(this.layout)) {
      return;
    }
    const { paddingLeft, paddingRight, paddingTop, paddingBottom } = this.layout.style;
    if (this.innerText.style.wordWrap) {
      const scale = this.layout.container?.scale.x ?? 1;
      this.innerText.style.wordWrapWidth = (width - paddingLeft - paddingRight) * scale;
    } else {
      this.innerText.scale.set(1);
      const textWidth = this.innerText.width + paddingLeft + paddingRight;
      const textHeight = this.innerText.height + paddingTop + paddingBottom;
      const horOverflow = textWidth > width;
      const verOverflow = textHeight > height;
      const horScale = width / (textWidth + paddingLeft + paddingRight);
      const vertScale = height / (textHeight + paddingBottom + paddingTop);
      if (horOverflow || verOverflow) {
        this.innerText.scale.set(Math.min(horScale, vertScale));
      }
    }
  }
  /**
   * Get type of size control basing on styles and in case if width of the layout is set to `auto`.
   * @param size - Width or height of the layout.
   */
  getAutoSizeModificator(size) {
    const { background, display } = this.layout.style;
    if (size !== "auto") {
      return "static";
    }
    if (display === "block") {
      return "parentSize";
    }
    if (background instanceof Container && background.width && background.height) {
      return "background";
    }
    if (isItJustAText(this.layout) && this.layout.style.wordWrap) {
      return "innerText";
    }
    if (size === "auto") {
      return "contentSize";
    }
    return "static";
  }
  /**
   * Get text element if layout is just a wrapper for a text element.
   * @returns {Text} - Pixi Text element.
   */
  get innerText() {
    if (!isItJustAText(this.layout)) {
      return null;
    }
    const { firstChild } = this.layout.content;
    return firstChild;
  }
  /** Get width of the controlled layout. */
  get width() {
    return this._width;
  }
  /**
   * Set width of the controlled layout. And align children.
   * @param {FlexNumber} width - Width to set.
   */
  set width(width) {
    this._width = getNumber(width, this.parentWidth);
    this.layout.align.resize(this.parentWidth, this.parentHeight);
  }
  /** Get height of the controlled layout. */
  get height() {
    return this._height;
  }
  /**
   * Set height of the controlled layout. And align children.
   * @param {FlexNumber} height - Height to set.
   */
  set height(height) {
    this._height = getNumber(height, this.parentHeight);
    this.layout.align.resize(this.parentWidth, this.parentHeight);
  }
  /**
   * Fits controlled layout into parent size, scales it down if does not fit.
   *
   * This method is called when maxWidth or maxHeight is set.
   * @param parentWidth
   * @param parentHeight
   */
  fitToSize(parentWidth, parentHeight) {
    const { maxWidth, maxHeight, minWidth, minHeight, aspectRatio } = this.layout.style;
    const { marginLeft, marginRight, marginBottom, marginTop } = this.layout.style;
    const currentScaleX = this.layout.container.scale.x;
    const currentScaleY = this.layout.container.scale.y;
    const layoutWidth = this.layout.width + marginLeft + marginRight;
    const layoutHeight = this.layout.height + marginTop + marginBottom;
    const maxWidthVal = getNumber(maxWidth, parentWidth);
    const maxHeightVal = getNumber(maxHeight, parentHeight);
    const minWidthVal = getNumber(minWidth, parentWidth);
    const minHeightVal = getNumber(minHeight, parentHeight);
    if (aspectRatio === "flex") {
      if (maxWidthVal && this.width > maxWidthVal) {
        this.width = maxWidthVal;
      }
      if (maxHeightVal && this.height > maxHeightVal) {
        this.height = maxHeightVal;
      }
      let minWidthScale;
      let minHeightScale;
      if (minWidthVal && this.width < minWidthVal) {
        minWidthScale = this.width / minWidthVal;
        this.width = minWidthVal;
      }
      if (minHeightVal && this.height < minHeightVal) {
        minHeightScale = this.height / minHeightVal;
        this.height = minHeightVal;
      }
      if (minWidthScale || minHeightScale) {
        const scale = minWidthScale && minHeightScale ? Math.min(minWidthScale, minHeightScale) : minWidthScale ?? minHeightScale;
        this.layout.container.scale.set(scale);
      }
      return;
    }
    const maxFitScaleX = maxWidthVal / layoutWidth;
    const maxFitScaleY = maxHeightVal / layoutHeight;
    const minFitScaleX = minWidthVal / layoutWidth;
    const minFitScaleY = minHeightVal / layoutHeight;
    let finalScaleX = currentScaleX;
    let finalScaleY = currentScaleY;
    if (layoutWidth * currentScaleX > maxWidthVal) {
      finalScaleX = maxFitScaleX;
    }
    if (layoutHeight * currentScaleY > maxHeightVal) {
      finalScaleY = maxFitScaleY;
    }
    let finalScaleToFit = Math.min(finalScaleX, finalScaleY);
    if (minWidth || minHeight) {
      if (minWidth && minHeight) {
        finalScaleToFit = Math.max(minFitScaleX, minFitScaleY);
      } else if (minWidth) {
        finalScaleToFit = finalScaleX;
      } else if (minHeight) {
        finalScaleToFit = minFitScaleY;
      }
    }
    this.layout.container.scale.set(finalScaleToFit);
  }
}

export { SizeController };
//# sourceMappingURL=SizeController.mjs.map
