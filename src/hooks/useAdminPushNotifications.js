import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../config/firebase';
import { supabase } from '../config/supabase'; // Assuming there is a config/supabase.js
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext provides the current user

export const useAdminPushNotifications = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const { adminUser } = useAuth();

  useEffect(() => {
    if (!adminUser || !messaging) return;

    const requestPermissionAndGetToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // You must provide the VAPID key here from your Firebase console
          // Web Push certificates tab in Cloud Messaging settings
          const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
          if (!vapidKey) {
            console.warn('VITE_FIREBASE_VAPID_KEY is missing. Cannot register FCM token.');
            return;
          }

          const currentToken = await getToken(messaging, { vapidKey });
          if (currentToken) {
            setFcmToken(currentToken);
            // Save token to Supabase
            await supabase.from('admin_fcm_tokens').upsert({
              user_id: adminUser.id,
              token: currentToken,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id, token' });

            
            console.log('FCM token registered and saved to Supabase');
          } else {
            console.log('No registration token available.');
          }
        } else {
          console.log('Notification permission denied.');
        }
      } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
      }
    };

    requestPermissionAndGetToken();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      // Depending on your UI library, you can show a toast here
      // For now, we will fallback to native browser notification if allowed
      if (Notification.permission === 'granted') {
        const notificationTitle = payload.notification?.title || 'New Notification';
        const notificationOptions = {
          body: payload.notification?.body,
          icon: '/logo.png',
        };
        new Notification(notificationTitle, notificationOptions);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [adminUser]);

  return { fcmToken };
};

