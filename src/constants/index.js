import * as yup from 'yup';

export const INCORRECT_PASSWORD = 'Mật khẩu sai!';
const INVALID_FORMAT = 'Định dạng sai!';
const REQUIRED_FIELD = 'Trường này là bắc buộc!';
const INVALID_SPACES = 'Không được có khoảng trắng ở đầu và cuối';
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
const PASSWORD_REGEX = /^[A-Za-z0-9]{8,16}$/g;
const PHONE_NUMBER_REGEX = /^\d{8,16}$/g;
const ROOM_RATE_REGEX = /^\d+$/g;

export const nameValidator = yup
  .string()
  .min(1, INVALID_FORMAT)
  .required(REQUIRED_FIELD)
  .trim(INVALID_SPACES);

export const emailValidator = yup
  .string()
  .email(INVALID_FORMAT)
  .matches(EMAIL_REGEX, { message: INVALID_FORMAT })
  .required(REQUIRED_FIELD)
  .trim(INVALID_SPACES);

export const passwordValidator = yup
  .string()
  .matches(PASSWORD_REGEX, { message: INVALID_FORMAT })
  .required(REQUIRED_FIELD)
  .trim(INVALID_SPACES);

export const confirmPasswordValidator = yup
  .string()
  .oneOf([yup.ref('password'), null], INCORRECT_PASSWORD);

export const addressValidator = yup
  .string()
  .notRequired()
  .min(1, INVALID_FORMAT)
  .trim(INVALID_SPACES)
  .transform((value) => value || null);

export const phoneNumberValidator = yup
  .string()
  .notRequired()
  .matches(PHONE_NUMBER_REGEX, INVALID_FORMAT)
  .trim(INVALID_SPACES)
  .transform((value) => value || null);

export const titleValidator = nameValidator;

export const roomRateValidator = yup
  .string()
  .matches(ROOM_RATE_REGEX, INVALID_FORMAT)
  .required(REQUIRED_FIELD)
  .trim(INVALID_SPACES);

export const addressRoomValidator = yup
  .string()
  .required(REQUIRED_FIELD)
  .min(1, INVALID_FORMAT)
  .trim(INVALID_SPACES);

export const areaValidator = yup
  .string()
  .notRequired()
  .matches(ROOM_RATE_REGEX, INVALID_FORMAT)
  .trim(INVALID_SPACES);

export const descriptionValidator = yup
  .string()
  .notRequired()
  .min(1, INVALID_FORMAT)
  .trim(INVALID_SPACES);
