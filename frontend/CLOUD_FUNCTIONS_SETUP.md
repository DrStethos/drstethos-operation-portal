# Firebase Cloud Functions Setup for DrStethos Admin

## Overview
This implements Firebase Cloud Functions to send FCM (Firebase Cloud Messaging) notifications when doctor and hospital profiles are approved or rejected.

## What's been set up:

### 1. **Firebase Cloud Functions** (`/functions/src/index.ts`)
Two main cloud functions:

#### `sendApprovalNotification()`
- Sends a single FCM notification
- Called when approving/rejecting a doctor or hospital profile
- Parameters:
  - `userId`: User's Firebase ID
  - `fcmToken`: Device's FCM token
  - `name`: User's name
  - `status`: "APPROVED" or "REJECTED"
  - `rejectionReason`: (optional) Reason for rejection
  - `profileType`: "DOCTOR" or "HOSPITAL"
  - `profileId`: Profile document ID

#### `sendBatchNotifications()`
- Sends multiple notifications in one call
- Useful for bulk operations
- Takes array of notification objects

### 2. **Frontend Integration**
- Created `src/helpers/notificationHelper.ts` - Helper functions to call cloud functions
- Updated `DoctorProfile.tsx` - Now sends FCM notification on approve/reject
- Updated `HospitalProfile.tsx` - Now sends FCM notification on approve/reject
- Updated `src/lib/firebase.ts` - Added Firebase Functions initialization

### 3. **Features**
✅ Sends notifications via FCM token
✅ Logs all notifications to `notification_logs` collection
✅ Logs errors to `notification_errors` collection
✅ Works alongside existing email notifications
✅ Includes rejection reason in rejection notifications
✅ Error handling and fallback messages

---

## 🚀 Setup Instructions

### Step 1: Prepare Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (drstethos-app)
3. Go to Settings → Service Accounts → Firebase Admin SDK
4. Click "Generate new private key"
5. Save the JSON file as `functions/service-account-key.json`

⚠️ **Important**: This file is already in `.gitignore` - never commit it to Git!

### Step 2: Install Dependencies
```bash
cd functions
npm install
```

### Step 3: Deploy Cloud Functions
```bash
firebase login
firebase deploy --only functions
```

Or with specific project:
```bash
firebase deploy --project drstethos-app --only functions
```

### Step 4: Verify Deployment
```bash
firebase functions:list
firebase functions:log
```

---

## 📱 How It Works

### When Doctor/Hospital is Approved:
1. Admin clicks "Approve" button
2. Firestore documents are updated
3. Cloud Function `sendApprovalNotification()` is called
4. FCM notification is sent to user's device
5. Notification is logged in `notification_logs` collection
6. Email notification is also sent

### When Doctor/Hospital is Rejected:
1. Admin clicks "Reject" and enters reason
2. Firestore documents are updated with rejection reason
3. Cloud Function `sendApprovalNotification()` is called with rejection reason
4. FCM notification is sent with rejection reason
5. Error is logged if notification fails
6. Email notification is also sent

---

## 🔥 Firestore Collections Created

### `notification_logs`
Stores successful notifications:
```
{
  userId: string,
  profileType: "DOCTOR" | "HOSPITAL",
  profileId: string,
  status: "APPROVED" | "REJECTED",
  title: string,
  body: string,
  fcmToken: string (partial, for privacy),
  messageId: string,
  sentAt: timestamp,
  sentByAdmin: string (admin UID)
}
```

### `notification_errors`
Stores failed notification attempts:
```
{
  userId: string,
  profileType: "DOCTOR" | "HOSPITAL",
  profileId: string,
  status: "APPROVED" | "REJECTED",
  fcmToken: string (partial, for privacy),
  error: string,
  timestamp: timestamp,
  attemptedByAdmin: string (admin UID)
}
```

---

## 🧪 Testing

### Test in Firebase Console:
1. Go to Functions tab in Firebase Console
2. Look for `sendApprovalNotification`
3. Click "Testing" tab
4. Paste test payload:
```json
{
  "userId": "test-user-id",
  "fcmToken": "your-fcm-token-here",
  "name": "Test Doctor",
  "status": "APPROVED",
  "profileType": "DOCTOR",
  "profileId": "doc-123"
}
```

### Test Locally with Emulator:
```bash
# In functions directory
npm run serve

# In another terminal, test the function
curl http://localhost:5001/drstethos-app/asia-south1/sendApprovalNotification \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "userId": "test-user",
      "fcmToken": "test-token",
      "name": "Test",
      "status": "APPROVED",
      "profileType": "DOCTOR",
      "profileId": "123"
    }
  }'
```

---

## 🔐 Security Notes

1. **FCM Tokens are secure**: Only stored partially in logs (first 20 chars)
2. **Authentication required**: Cloud Functions check `context.auth`
3. **Admin-only actions**: Only authenticated admin users can approve/reject
4. **Sensitive data**: Service account key is in `.gitignore`

---

## 📋 Checklist Before Going Live

- [ ] Service account key configured in `functions/service-account-key.json`
- [ ] Dependencies installed: `npm install` in functions/
- [ ] Cloud Functions deployed: `firebase deploy --only functions`
- [ ] Region set correctly in code: `asia-south1`
- [ ] Firestore security rules allow cloud functions to write logs
- [ ] FCM tokens being saved in user documents during registration
- [ ] Tested approval/rejection flow with real FCM token
- [ ] Check notification_logs collection for successful sends
- [ ] Check notification_errors collection for any issues

---

## 🐛 Troubleshooting

### "Functions not found" error
- Ensure you've deployed: `firebase deploy --only functions`
- Check project ID is correct: `firebase projects:list`

### "Missing required fields" error
- Verify fcmToken is being passed from user data
- Check that user document has `fcmToken` field

### Notifications not arriving
- Check FCM token is valid and from same Firebase project
- Verify app has notification permissions on device
- Check notification_errors collection for detailed error
- Verify Cloud Functions logs in Firebase Console

### "Unauthenticated" error
- Ensure admin is logged in with proper credentials
- Check Firestore security rules allow the operation

---

## 📚 Resources

- [Firebase Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Cloud Functions Node.js Guide](https://firebase.google.com/docs/functions/get-started/create-deploy)

---

## 📞 Support

If you encounter issues:
1. Check Firebase Console → Functions → Logs
2. Check Firestore for `notification_errors` collection
3. Verify service account key is correctly placed
4. Check browser console for frontend errors
5. Review the error message in notification_errors collection
