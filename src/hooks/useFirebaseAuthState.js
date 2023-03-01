import { useEffect, useState } from 'react';
import { firebaseAuthStateChanged } from '../firebase/auth';
import { userSnapshot } from '../firebase/cloudFirestore';

const useFirebaseAuthState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    let snapshotUnsubscribe;
    const unsubscribe = firebaseAuthStateChanged((userAuth) => {
      if (userAuth?.uid) {
        snapshotUnsubscribe = userSnapshot(userAuth.uid, (user) => {
          if (user.data()) setUser({ ...user.data(), id: user.id });
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
      snapshotUnsubscribe?.();
    };
  }, []);

  return user;
};

export default useFirebaseAuthState;
