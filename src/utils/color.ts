import tinycolor from 'tinycolor2';

export const isValid = (color: tinycolor.ColorInput) => {
  return tinycolor(color).isValid();
};

export const isTransparent = (color: tinycolor.ColorInput) => {
  return tinycolor(color).getAlpha() === 0;
}