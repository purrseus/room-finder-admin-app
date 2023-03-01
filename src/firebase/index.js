import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA51o4EVHE1UDYTYQ7nq8KMaqCN_H5Wx_o',
  authDomain: 'room-finder-app-3672b.firebaseapp.com',
  projectId: 'room-finder-app-3672b',
  storageBucket: 'room-finder-app-3672b.appspot.com',
  messagingSenderId: '91038105266',
  appId: '1:91038105266:web:9dad1d7cc7799b047113ab',
  measurementId: 'G-0ZDVCKX2MB',
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firebaseCloudFirestore = getFirestore(app);

export const firebaseStorage = getStorage(app);
