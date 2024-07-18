'use strict';

var pixi_js = require('pixi.js');

function getNumber(value, maxPercentValue) {
  if (value === void 0) {
    return void 0;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    if (value.endsWith("px")) {
      return Math.floor(parseInt(value.slice(0, -2), 10));
    } else if (value.endsWith("%")) {
      const val = parseInt(value.slice(0, -1), 10);
      return Math.floor(
        maxPercentValue ? maxPercentValue / 100 * val : val
      );
    }
    return Math.floor(parseInt(value, 10));
  }
  return 0;
}
function stylesToPixiTextStyles(styles) {
  const resultStyles = {
    align: styles?.textAlign,
    breakWords: styles?.breakWords,
    dropShadow: styles?.dropShadow,
    fill: styles?.fill ?? styles?.color,
    fontFamily: styles?.fontFamily,
    fontSize: styles?.fontSize,
    fontStyle: styles?.fontStyle,
    fontVariant: styles?.fontVariant,
    fontWeight: styles?.fontWeight,
    leading: styles?.leading,
    textBaseline: styles?.textBaseline,
    letterSpacing: styles?.letterSpacing,
    lineHeight: styles?.lineHeight,
    trim: styles?.trim,
    // padding: styles?.padding ?? 0,
    stroke: styles?.stroke,
    whiteSpace: styles?.whiteSpace,
    wordWrap: styles?.wordWrap,
    wordWrapWidth: styles?.wordWrapWidth ?? 100
  };
  for (const key in resultStyles) {
    if (resultStyles[key] === void 0) {
      delete resultStyles[key];
    }
  }
  return resultStyles;
}
function isItJustAText(layout) {
  const hasOnly1Child = layout.content.children.size === 1;
  if (hasOnly1Child) {
    const firstChild = layout.content.children.entries().next().value[1];
    return firstChild instanceof pixi_js.Text;
  }
  return false;
}

exports.getNumber = getNumber;
exports.isItJustAText = isItJustAText;
exports.stylesToPixiTextStyles = stylesToPixiTextStyles;
//# sourceMappingURL=helpers.js.map
