import {
  Dimensions,
} from 'react-native';

// 以iPhone 6s Plus(1242 * 2208) 为基础设计尺寸
const default_pixel_ratio = 3;
const default_design_win = {w:1242/default_pixel_ratio, h:2208/default_pixel_ratio};
let c_win = Dimensions.get('window');
// 实际手机缩放比例
const scale = Math.min(c_win.width/default_design_win.w, c_win.height/default_design_win.h);

export default class FitViewUtils {
  static scaleSize(pixel) {
    let size = Math.round((pixel*scale+0.5)/default_pixel_ratio);
    return size;
  }
}

export var scaleSize = (pixel) => {
  let size = Math.round((pixel*scale+0.5)/default_pixel_ratio);
  return size;
}