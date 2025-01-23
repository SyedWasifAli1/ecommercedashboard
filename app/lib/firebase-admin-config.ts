import admin from "firebase-admin";
import path from "path";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();

if (!admin.apps.length) {
  const serviceAccountPath = path.resolve(
    process.cwd(),
    process.env.GOOGLE_APPLICATION_CREDENTIALS!);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL ,
  });
}

export default admin;





// // import { initializeApp, cert, getApps } from 'firebase-admin/app';
// // import { getAuth } from 'firebase-admin/auth';

// // // Add your Firebase Admin SDK service account key here
// // const serviceAccount = {
// //   type: "service_account",
// //   project_id: "authwithfirebase-20a41",
// //   private_key_id: "YOUR_PRIVATE_KEY_ID",
// //   private_key: "YOUR_PRIVATE_KEY".replace(/\\n/g, '\n'), // Ensure newlines in private_key
// //   client_email: "firebase-adminsdk-xxx@authwithfirebase-20a41.iam.gserviceaccount.com",
// //   client_id: "YOUR_CLIENT_ID",
// //   auth_uri: "https://accounts.google.com/o/oauth2/auth",
// //   token_uri: "https://oauth2.googleapis.com/token",
// //   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
// //   client_x509_cert_url: "YOUR_CLIENT_X509_CERT_URL"
// // };

// // // Initialize Admin SDK if not already initialized
// // if (!getApps().length) {
// //   initializeApp({
// //     credential: cert(serviceAccount),
// //   });
// // }

// // const auth = getAuth();

// // export { auth };
