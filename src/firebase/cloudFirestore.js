import {
  collection,
  doc, onSnapshot,
  orderBy,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import { firebaseCloudFirestore } from '.';

export const deleteUser = async (userId) => {
  if (!userId) return;

  await setDoc(
    doc(firebaseCloudFirestore, 'users', userId),
    {
      deletedAt: new Date().toISOString(),
    },
    { merge: true },
  );
};

export const userSnapshot = (id, cb) => {
  return onSnapshot(doc(firebaseCloudFirestore, 'users', id), cb);
};

export const approvePost = async (postId) => {
  await setDoc(
    doc(firebaseCloudFirestore, 'posts', postId),
    {
      approved: true,
    },
    { merge: true },
  );
};

export const deletePost = async (postId) => {
  if (!postId) return;

  await setDoc(
    doc(firebaseCloudFirestore, 'posts', postId),
    {
      deletedAt: new Date().toISOString(),
    },
    { merge: true },
  );
};

export const userManagementSnapshot = (cb) => {
  const q = query(
    collection(firebaseCloudFirestore, 'users'),
    where('deletedAt', '==', null),
    orderBy('updatedAt', 'desc'),
  );
  return onSnapshot(q, cb);
};

export const postManagementSnapshot = (cb) => {
  const q = query(
    collection(firebaseCloudFirestore, 'posts'),
    where('deletedAt', '==', null),
    orderBy('updatedAt', 'desc'),
  );
  return onSnapshot(q, cb);
};

export const postSnapshot = (postId, cb) => {
  return onSnapshot(doc(firebaseCloudFirestore, 'posts', postId), cb);
};
