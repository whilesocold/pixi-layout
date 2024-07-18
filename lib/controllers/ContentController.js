'use strict';

var pixi_js = require('pixi.js');
var Layout = require('../Layout.js');
var helpers = require('../utils/helpers.js');

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ContentController {
  /**
   * Creates all instances and manages configs
   * @param {LayoutSystem} layout - Layout instance
   * @param content - Content of the layout
   * @param globalStyles - Global styles for layout and it's children
   */
  constructor(layout, content, globalStyles) {
    __publicField(this, "layout");
    /**
     * List of all children of the layout, controlled by this controller.
     * As the layout is a container, you can use all container methods on it,
     * including addChild, but only elements added by layout
     * config thought constructor of {@link ContentController} or using
     * `addContent` method will be managed by this controller.
     */
    __publicField(this, "children", /* @__PURE__ */ new Map());
    this.layout = layout;
    this.children = /* @__PURE__ */ new Map();
    this.createContent(content, globalStyles);
    this.layout.container.on(
      "childRemoved",
      (child) => this.onChildRemoved(child)
    );
  }
  /**
   * Adds content to the layout.
   * @param {Content} content - Content of the layout
   * @param {LayoutStyles} parentGlobalStyles - Global styles for layout and it's children
   */
  createContent(content, parentGlobalStyles) {
    if (!content)
      return;
    const contentType = this.getContentType(content);
    const customID = this.newID;
    switch (contentType) {
      case "layout":
        const layout = content;
        if (!layout.id) {
          layout.id = `layout-${customID}`;
        }
        this.addContentElement(layout.id, layout);
        break;
      case "container":
        this.addContentElement(
          `container-${customID}`,
          content
        );
        break;
      case "string":
        const text = new pixi_js.Text({
          text: content,
          style: this.layout.textStyle
        });
        this.addContentElement(`text-${customID}`, text);
        break;
      case "text":
        const textInstance = content;
        for (const key in this.layout.textStyle) {
          const styleKey = key;
          textInstance.style[styleKey] = this.layout.textStyle[styleKey];
        }
        this.addContentElement(`text-${customID}`, textInstance);
        break;
      case "layoutConfig":
        const layoutConfig = content;
        if (parentGlobalStyles) {
          if (layoutConfig.globalStyles) {
            layoutConfig.globalStyles = {
              ...parentGlobalStyles,
              ...layoutConfig.globalStyles
            };
          } else {
            layoutConfig.globalStyles = { ...parentGlobalStyles };
          }
        }
        if (!layoutConfig.id) {
          layoutConfig.id = `layout-${customID}`;
        }
        this.addContentElement(
          layoutConfig.id,
          new Layout.Layout(layoutConfig)
        );
        break;
      case "object":
        const contentList = content;
        for (const id in contentList) {
          const idKey = id;
          const contentElement = content[idKey];
          const contentType2 = this.getContentType(contentElement);
          let defaultStyles = this.layout.textStyle;
          switch (contentType2) {
            case "string":
              if (parentGlobalStyles && parentGlobalStyles[idKey]) {
                defaultStyles = {
                  ...defaultStyles,
                  ...helpers.stylesToPixiTextStyles(
                    parentGlobalStyles[idKey]
                  )
                };
              }
              const text2 = new pixi_js.Text({
                text: contentElement,
                style: defaultStyles
              });
              this.addContentElement(idKey, text2);
              break;
            case "text":
              const textInstance2 = contentElement;
              if (parentGlobalStyles && parentGlobalStyles[idKey]) {
                defaultStyles = {
                  ...defaultStyles,
                  ...helpers.stylesToPixiTextStyles(
                    parentGlobalStyles[idKey]
                  )
                };
              }
              textInstance2.style = defaultStyles;
              this.addContentElement(idKey, textInstance2);
              break;
            case "layout":
              const layoutInstance = contentElement;
              if (parentGlobalStyles && parentGlobalStyles[idKey]) {
                layoutInstance.setStyles(
                  parentGlobalStyles[idKey]
                );
                layoutInstance.layout.updateParents();
              }
              this.createContent(layoutInstance);
              break;
            case "container":
              this.addContentElement(idKey, contentElement);
              break;
            case "layoutConfig":
              this.createContent({
                ...contentElement,
                globalStyles: parentGlobalStyles,
                id: idKey
                // we are rewriting this id with the key of the object, even if it is set
              });
              break;
            case "object":
              this.createContent(
                contentElement,
                parentGlobalStyles
              );
              break;
            case "array":
              this.createContent(
                contentElement,
                parentGlobalStyles
              );
              break;
          }
        }
        break;
      case "array":
        const contentArray = content;
        contentArray.forEach(
          (content2) => this.createContent(content2, parentGlobalStyles)
        );
        break;
      default:
        throw new Error("Unknown content type of the layout.");
    }
  }
  /**
   * Adds content element to the layout and register it in Content controller registry.
   * @param {string} id - ID of the element.
   * @param {Container } content - pixi container instance to be added.
   */
  addContentElement(id, content) {
    if (id && this.children.has(id)) {
      console.error(
        `Element with '${id}' duplicates, be careful using id selectors with it.`
      );
    }
    this.children.set(id, content);
    this.layout.container.addChild(content);
  }
  /**
   * Get first child of the layout
   * @returns {Container} - First child of the layout
   */
  get firstChild() {
    return this.children.get(this.children.keys().next().value);
  }
  /**
   * Resizes all children.
   * @param width
   * @param height
   */
  resize(width, height) {
    this.children.forEach((child) => {
      if (child.isPixiLayout || child instanceof Layout.Layout) {
        child.layout.resize(width, height);
      }
    });
  }
  get newID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  /**
   * Get element from the layout child tree by it's ID
   * @param id
   */
  getByID(id) {
    let result = this.children.get(id);
    if (!result) {
      this.children.forEach((child) => {
        if (child.isPixiLayout || child instanceof Layout.Layout) {
          const res = child.layout.content.getByID(id);
          if (res) {
            result = res;
          }
        }
      });
    }
    return result;
  }
  getContentType(content) {
    if (typeof content === "string")
      return "string";
    if (content instanceof pixi_js.Text)
      return "text";
    if (content instanceof Layout.Layout)
      return "layout";
    if (content.isPixiLayout)
      return "layout";
    if (content instanceof pixi_js.Sprite || content instanceof pixi_js.Graphics || content instanceof pixi_js.Container) {
      if (content.isPixiLayout)
        return "layout";
      return "container";
    }
    if (Array.isArray(content))
      return "array";
    if (typeof content === "object") {
      if (content?.content) {
        return "layoutConfig";
      }
      return "object";
    }
    return "unknown";
  }
  /**
   * Removes content by its id.
   * @param id
   */
  removeContent(id) {
    const content = this.getByID(id);
    if (content) {
      this.layout.container.removeChild(content);
      this.children.delete(id);
    }
  }
  onChildRemoved(child) {
    const registeredChild = this.getChild(child);
    if (registeredChild) {
      this.children.delete(registeredChild);
      this.layout.updateParents();
    }
  }
  getChild(childInstance) {
    for (const [key, value] of this.children.entries()) {
      if (value === childInstance) {
        return key;
      }
    }
    return void 0;
  }
}

exports.ContentController = ContentController;
//# sourceMappingURL=ContentController.js.map
