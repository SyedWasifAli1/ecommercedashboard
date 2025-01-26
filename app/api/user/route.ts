/* eslint-disable @typescript-eslint/no-require-imports */
// import { NextResponse } from "next/server";
// import admin from "@/app/lib/firebase-admin-config"; // Adjust path if needed

// export async function GET() {
//   try {
//     const users: Array<{
//       email: string | undefined;
//       uid: string;
//       createdAt: string | undefined;
//       lastSignInTime: string | undefined;
//     }> = [];

//     let nextPageToken: string | undefined = undefined; // Used for pagination

//     do {
//       const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
//       listUsersResult.users.forEach((userRecord) => {
//         users.push({
//           email: userRecord.email,
//           uid: userRecord.uid,
//           createdAt: userRecord.metadata.creationTime,
//           lastSignInTime: userRecord.metadata.lastSignInTime,
//         });
//       });
//       nextPageToken = listUsersResult.pageToken;
//     } while (nextPageToken);

//     return NextResponse.json(users, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }
import { NextApiRequest, NextApiResponse } from "next";
import admin from "../../lib/firebase-admin-config"; 

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users: Array<{
      email: string | undefined;
      uid: string;
      createdAt: string | undefined;
      lastSignInTime: string | undefined;
    }> = [];

    let nextPageToken: string | undefined; 

    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      users.push(...listUsersResult.users.map((userRecord) => ({
        email: userRecord.email,
        uid: userRecord.uid,
        createdAt: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      })));
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}