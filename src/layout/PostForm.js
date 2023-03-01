import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image as RNImage,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../assets/theme/colors';
import globalStyles from '../assets/theme/globalStyles';
import Background from '../components/Background';
import Button from '../components/Button';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';
import LargeCard from '../components/LargeCard';
import OutlinedTextInput from '../components/OutlinedTextInput';
import Spacer from '../components/Spacer';
import { alphaHexColor, focusInput } from '../utils';
import * as yup from 'yup';
import {
  areaValidator,
  addressRoomValidator,
  descriptionValidator,
  nameValidator,
  roomRateValidator,
} from '../constants';
import { showTopToast } from '../components/ToastNotification';
import { launchImageLibraryAsync } from 'expo-image-picker';
import useFirebaseAuthState from '../hooks/useFirebaseAuthState';
import Image from '../components/Image';

const RadioButton = ({ label, value, currentValue, setIsChecked }) => {
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        hitSlop={4}
        activeOpacity={1}
        onPress={() => setIsChecked(value)}
        style={styles.radioButton}
      >
        <View
          style={[
            styles.innerRadioButton,
            currentValue !== value && { backgroundColor: 'transparent' },
          ]}
        />
      </TouchableOpacity>

      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );
};

const Checkbox = ({ label, isChecked, setIsChecked }) => {
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        hitSlop={4}
        activeOpacity={1}
        onPress={() => setIsChecked(!isChecked)}
        style={styles.checkboxButton}
      >
        <RNImage
          source={require('../assets/icons/check/check.png')}
          style={[styles.checkIcon, !isChecked && { opacity: 0 }]}
        />
      </TouchableOpacity>

      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );
};

const Field = ({ children, label = '', style }) => {
  return (
    <View style={[styles.fieldContainer, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
};

const PostForm = ({
  navigation,
  title,
  defaultValues = {},
  handleButtonPress,
}) => {
  const { height, width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const user = useFirebaseAuthState();

  const [postInfo, setPostInfo] = useState({
    hasWaterHeater: defaultValues?.hasWaterHeater || false,
    hasAirCondition: defaultValues?.hasAirCondition || false,
    hasWifi: defaultValues?.hasWifi || false,
    hasParking: defaultValues?.hasParking || false,
    hasFridge: defaultValues?.hasFridge || false,
    hasTV: defaultValues?.hasTV || false,
    photo: defaultValues?.photo || null,
    isOutOfRoom: defaultValues?.isOutOfRoom || false,
  });

  const roomRateRef = useRef(null);
  const areaRef = useRef(null);
  const addressRef = useRef(null);
  const descriptionRef = useRef(null);

  const changeState = (key) => (value) =>
    setPostInfo((prevState) => ({ ...prevState, [key]: value }));

  const removePhoto = () => changeState('photo')(null);

  const blurDescription = () => descriptionRef.current?.blur();

  const defaultFormValues = {
    title: defaultValues?.title || '',
    roomRate: `${defaultValues?.roomRate || ''}`,
    address: defaultValues?.address || '',
    area: `${defaultValues?.area || ''}`,
    description: defaultValues?.description || '',
  };

  const { control, handleSubmit } = useForm(
    useMemo(
      () => ({
        values: defaultFormValues,
        resolver: yupResolver(
          yup.object().shape({
            title: nameValidator,
            roomRate: roomRateValidator,
            address: addressRoomValidator,
            area: areaValidator,
            description: descriptionValidator,
          }),
        ),
      }),
      [defaultValues],
    ),
  );

  const getPreviewPhoto = async () => {
    try {
      const pickerResult = await launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        mediaTypes: 'Images',
      });

      if (pickerResult?.assets?.[0]?.uri) {
        changeState('photo')(pickerResult?.assets?.[0]?.uri);
      }
    } catch (error) {
      showTopToast(error);
    }
  };

  const onSubmit = (values) => {
    handleButtonPress({
      ...values,
      ...postInfo,
      userId: user?.id,
    });
  };

  return (
    <Background topDecorHeight={0.15} style={globalStyles.flexFill}>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={12}
          onPress={navigation.goBack}
          style={styles.back}
        >
          <RNImage
            source={require('../assets/icons/arrow-left/arrow-left.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={12}
          disabled
          onPress={navigation.goBack}
          style={[styles.back, { opacity: 0 }]}
        >
          <RNImage
            source={require('../assets/icons/arrow-left/arrow-left.png')}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        style={[styles.body, { marginTop: height * 0.15 - top }]}
      >
        <LargeCard style={{ marginTop: 16, marginBottom: bottom || 32 }}>
          <Controller
            control={control}
            name="title"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <OutlinedTextInput
                {...{ onChangeText: onChange, onBlur, value }}
                errorMessage={error?.message}
                label="Tiêu đề"
                returnKeyType="next"
                onSubmitEditing={focusInput(roomRateRef)}
              />
            )}
          />

          <Controller
            control={control}
            name="roomRate"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <OutlinedTextInput
                {...{ onChangeText: onChange, onBlur, value }}
                errorMessage={error?.message}
                ref={roomRateRef}
                label="Giá phòng/tháng"
                returnKeyType="next"
                keyboardType="number-pad"
                onSubmitEditing={focusInput(areaRef)}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <OutlinedTextInput
                {...{ onChangeText: onChange, onBlur, value }}
                errorMessage={error?.message}
                ref={addressRef}
                label="Địa chỉ"
                returnKeyType="next"
                textContentType="fullStreetAddress"
                onSubmitEditing={focusInput(descriptionRef)}
              />
            )}
          />

          <Controller
            control={control}
            name="area"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <OutlinedTextInput
                {...{ onChangeText: onChange, onBlur, value }}
                errorMessage={error?.message}
                ref={areaRef} // TODO: format currency input
                label="Diện tích (m2)"
                returnKeyType="next"
                keyboardType="number-pad"
                onSubmitEditing={focusInput(addressRef)}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <OutlinedTextInput
                {...{ onChangeText: onChange, onBlur, value }}
                errorMessage={error?.message}
                maxLength={1000}
                ref={descriptionRef}
                label="Mô tả"
                returnKeyType="next"
                multiline
                onSubmitEditing={blurDescription}
              />
            )}
          />

          <Field label="Tiện ích" style={styles.utilitiesField}>
            <Checkbox
              isChecked={postInfo.hasWaterHeater}
              setIsChecked={changeState('hasWaterHeater')}
              label="Nóng lạnh"
            />
            <Checkbox
              isChecked={postInfo.hasAirCondition}
              setIsChecked={changeState('hasAirCondition')}
              label="Điều hoà"
            />
            <Checkbox
              isChecked={postInfo.hasWifi}
              setIsChecked={changeState('hasWifi')}
              label="Wifi"
            />
            <Checkbox
              isChecked={postInfo.hasParking}
              setIsChecked={changeState('hasParking')}
              label="Chỗ để xe"
            />
            <Checkbox
              isChecked={postInfo.hasFridge}
              setIsChecked={changeState('hasFridge')}
              label="Tủ lạnh"
            />
            <Checkbox
              isChecked={postInfo.hasTV}
              setIsChecked={changeState('hasTV')}
              label="Tivi"
            />
          </Field>

          <Field label={postInfo.photo ? '' : 'Hình ảnh'}>
            {!!postInfo.photo && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={removePhoto}
                style={styles.removeImageButton}
              >
                <RNImage
                  source={require('../assets/icons/plus/plus.png')}
                  style={styles.removeIcon}
                />
              </TouchableOpacity>
            )}
            {postInfo.photo ? (
              <Image
                source={
                  defaultValues?.photo && !postInfo.photo?.startsWith('file')
                    ? { imageStorage: postInfo.photo }
                    : { uri: postInfo.photo }
                }
                resizeMode="cover"
                style={{
                  width: width - 30 * 4,
                  height: width - 30 * 4,
                  borderRadius: 4,
                }}
              />
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={getPreviewPhoto}
                style={styles.photoWrapper}
              >
                <Image source={require('../assets/icons/photo/photo.png')} />
                <Text style={styles.photoDescription}>
                  Nhấn vào để tải lên hình ảnh
                </Text>
              </TouchableOpacity>
            )}
          </Field>

          <View style={styles.radioContainer}>
            <RadioButton
              label="Còn phòng"
              value={false}
              currentValue={postInfo.isOutOfRoom}
              setIsChecked={changeState('isOutOfRoom')}
            />
            <RadioButton
              label="Hết phòng"
              value={true}
              currentValue={postInfo.isOutOfRoom}
              setIsChecked={changeState('isOutOfRoom')}
            />
          </View>

          <Spacer h={24} />

          <Button
            title="Đăng Bài"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          />
        </LargeCard>
      </KeyboardAwareScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  back: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    top: 16,
    marginHorizontal: 30,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  body: {
    flex: 1,
  },
  inputOutline: {
    borderWidth: 0.5,
    borderColor: alphaHexColor(colors.black, 0.3),
    backgroundColor: colors.white,
  },
  input: {
    fontSize: 12,
    marginBottom: 8,
    marginTop: 4,
  },
  contentInput: {},
  passwordIncorrect: {
    fontSize: 10,
    color: colors.red,
  },
  fieldContainer: {
    borderWidth: 0.5,
    borderColor: alphaHexColor(colors.black, 0.3),
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  fieldLabel: {
    color: colors.primary,
    fontSize: 12,
    padding: 4,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 8,
    top: -12,
  },
  utilitiesField: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxContainer: {
    flexDirection: 'row',
    width: '40%',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkboxButton: {
    padding: 4,
    backgroundColor: alphaHexColor(colors.primaryText, 0.2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    tintColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 10,
    borderColor: colors.primaryText,
    marginLeft: 4,
  },
  photoWrapper: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  photoDescription: {
    fontSize: 12,
    color: alphaHexColor(colors.primaryText, 0.6),
    marginTop: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    padding: 4,
    borderRadius: 99,
    backgroundColor: alphaHexColor(colors.primaryText, 0.2),
  },
  innerRadioButton: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  button: {
    paddingVertical: 12,
    marginHorizontal: 34,
  },
  removeImageButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10,
  },
  removeIcon: {
    tintColor: colors.primary,
    width: 10,
    height: 10,
    transform: [{ rotate: '45deg' }],
  },
});

export default PostForm;
