// import { NextApiRequest, NextApiResponse } from "next";
// import formidable, { Fields, Files, File } from "formidable";
// import fs from "fs";
// import path from "path";

// // Disable body parsing to handle file uploads
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const form = new formidable.IncomingForm();

//     form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
//       if (err) {
//         res.status(500).json({ error: "Error processing the file" });
//         return;
//       }

//       try {
//         // Ensure the uploads directory exists
//         const uploadDir = path.join(process.cwd(), "public/uploads");
//         if (!fs.existsSync(uploadDir)) {
//           fs.mkdirSync(uploadDir, { recursive: true });
//         }

//         // Validate and handle file upload
//         const file = files.image as File | File[] | undefined;

//         if (!file) {
//           res.status(400).json({ error: "No file uploaded" });
//           return;
//         }

//         const singleFile = Array.isArray(file) ? file[0] : file;

//         if (!singleFile.originalFilename) {
//           res.status(400).json({ error: "File does not have a valid name" });
//           return;
//         }

//         const newFilePath = path.join(uploadDir, singleFile.originalFilename);
//         fs.renameSync(singleFile.filepath, newFilePath);

//         // Construct product object
//         const product = {
//           name: fields.name,
//           description: fields.description,
//           category: fields.category,
//           price: fields.price,
//           stock: fields.stock,
//           imageUrl: `/uploads/${singleFile.originalFilename}`,
//         };

//         // Simulate saving to a database
//         console.log("Saved Product:", product);

//         res.status(200).json({ message: "Product added successfully!", product });
//       } catch (error) {
//         console.error("Error saving product:", error);
//         res.status(500).json({ error: "Internal server error" });
//       }
//     });
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
