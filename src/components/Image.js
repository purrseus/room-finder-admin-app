import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { Image as RNImage, LayoutAnimation } from 'react-native';
import colors from '../assets/theme/colors';
import { firebaseStorage } from '../firebase';
import { alphaHexColor } from '../utils';

const Image = ({ style, source, ...props }) => {
  const [image, setImage] = useState(source);

  useEffect(() => {
    if (typeof source === 'object' && source.imageStorage) {
      (async () => {
        try {
          const url = await getDownloadURL(
            ref(firebaseStorage, source.imageStorage),
          );
          LayoutAnimation.easeInEaseOut();
          setImage({ uri: url });
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [source]);

  return (
    <RNImage
      {...props}
      source={image}
      progressiveRenderingEnabled
      style={[{ backgroundColor: alphaHexColor(colors.primary, 0.2) }, style]}
    />
  );
};

export default Image;
