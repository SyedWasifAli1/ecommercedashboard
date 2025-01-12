// import admin from "@/firebase/admin"; // Firebase Admin SDK configuration
import admin from "../../app/lib/firebase-admin-config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ordersSnapshot = await admin.firestore().collection("user_orders").get();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders = ordersSnapshot.docs.map((doc:any) => {
      const data = doc.data();
      return {
        id: doc.id,
        datetime: data.datetime,
        deliveryDetails: data.deliveryDetails || {},
        paymentMethod: data.paymentMethod || "Unknown",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products: (data.products || []).map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          status: product.status || "Pending",
          totalPrice: product.totalPrice,
          available: product.available || false, // Add availability status
        })),
      };
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
}
