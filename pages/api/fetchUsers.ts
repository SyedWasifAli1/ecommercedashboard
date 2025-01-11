// import { NextApiRequest, NextApiResponse } from "next";
// import admin from "../../app/lib/firebase-admin-config";
// // import admin from "../../lib/firebase-admin";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const users: Array<{
//       email: string | undefined;
//       uid: string;
//       createdAt: string | undefined;
//       lastSignInTime: string | undefined;
//     }> = [];

//     let nextPageToken: string | undefined = undefined; // Used for pagination

//     do {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const listUsersResult:any = await admin.auth().listUsers(1000, nextPageToken);
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       listUsersResult.users.forEach((userRecord:any) => {
//         users.push({
//           email: userRecord.email,
//           uid: userRecord.uid,
//           createdAt: userRecord.metadata.creationTime,
//           lastSignInTime: userRecord.metadata.lastSignInTime,
//         });
//       });
//       nextPageToken = listUsersResult.pageToken;
//     } while (nextPageToken);

//     return res.status(200).json(users);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
