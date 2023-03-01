import numeral from 'numeral';
import colors from '../assets/theme/colors';
import 'numeral/locales/vi';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

numeral.locale('vi');
dayjs.locale('vi');

const MAX_DEPTH = 24;
const MIN_SHADOW_OPACITY = 0.2;
const MAX_SHADOW_OPACITY = 0.6;
const MAX_SHADOW_RADIUS = 16;

const SHADOW_OPACITY_PER_DEPTH =
  (MAX_SHADOW_OPACITY * 100 - MIN_SHADOW_OPACITY * 100) / MAX_DEPTH;
const SHADOW_RADIUS_PER_DEPTH = MAX_SHADOW_RADIUS / MAX_DEPTH;

export const shadowGenerator = (depth, shadowColor = colors.black) => ({
  shadowColor,
  shadowOffset: {
    width: 0,
    height: depth ? Math.floor(depth / 2) : 0,
  },
  shadowOpacity:
    Math.ceil(
      (depth ? MIN_SHADOW_OPACITY : 0) * 100 + SHADOW_OPACITY_PER_DEPTH * depth,
    ) / 100,
  shadowRadius: SHADOW_RADIUS_PER_DEPTH * depth,
  elevation: depth,
});

export const alphaHexColor = (hexColor, opacity) => {
  const MIN_OPACITY = 0.066;
  // Limit the opacity from 0 to 1
  const opacityRange = Math.min(Math.max(opacity, 0), 1);
  const safeOpacityValue =
    opacityRange > 0 && opacityRange < MIN_OPACITY ? MIN_OPACITY : opacityRange;
  const alpha = `${(safeOpacityValue * 255).toString(16)}0`.slice(0, 2);

  return `${hexColor}${alpha}`;
};

export const focusInput = (ref) => () => ref.current?.focus();

export const formatCurrency = (value = 0) => numeral(value).format('0,0 $');

export const formatDate = (value = new Date()) => dayjs(value).format('DD/MM/YYYY');

export const formatTextToSearch = (string = '') => {
  let str = string.toLowerCase();

  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  str = str.replace(/(đ)/g, 'd');

  return str;
};

export const utilityTitle = (text) => {
  return (
    {
      hasAirCondition: 'Điều hòa',
      hasFridge: 'Tủ lạnh',
      hasParking: 'Chỗ để xe',
      hasTV: 'Tivi',
      hasWaterHeater: 'Nóng lạnh',
      hasWifi: 'Wifi',
    }[text] || ''
  );
};
