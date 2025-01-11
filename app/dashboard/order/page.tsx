"use client";
import { useEffect, useState } from "react";
import {
  // collection,
  getDocs,
  query,
  collectionGroup,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../lib/firebase-config";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface DeliveryDetails {
  address: string;
  city: string;
  country: string;
  phone: string;
  province: string;
  street: string;
}

interface Order {
  orderId: string;
  userId: string;
  status: string;
  totalPrice: number;
  products: Product[];
  userEmail: string;
  deliveryDetails: DeliveryDetails;
  contactNumber: string;
  city: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryDetails | null>(null);

  // Fetch emails from the custom API
  const fetchEmails = async (): Promise<Record<string, string>> => {
    try {
      const response = await fetch("/api/fetchUsers"); // Adjust API route as needed
      if (!response.ok) {
        throw new Error("Failed to fetch user emails");
      }
      const users = await response.json();
      return users.reduce((map: Record<string, string>, user: { uid: string; email: string }) => {
        map[user.uid] = user.email || "No Email";
        return map;
      }, {});
    } catch (error) {
      console.error("Error fetching emails:", error);
      return {};
    }
  };

  // Fetch orders and match emails with user IDs
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);

        const emailMap = await fetchEmails();

        const ordersQuery = query(collectionGroup(firestore, "user_orders"));
        const querySnapshot = await getDocs(ordersQuery);

        const ordersData: Order[] = querySnapshot.docs.map((orderDoc) => {
          const orderData = orderDoc.data();
          const userId = orderDoc.ref.parent.parent?.id || "Unknown User";

          return {
            orderId: orderDoc.id,
            userId,
            userEmail: emailMap[userId] || "No Email",
            status: orderData.status || "Unknown",
            totalPrice: orderData.totalPrice || 0,
            products: orderData.products || [],
            deliveryDetails: orderData.deliveryDetails || {},
            contactNumber: orderData.deliveryDetails?.phone || "N/A",
            city: orderData.deliveryDetails?.city || "N/A",
          } as Order;
        });

        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const handleShowItems = (products: Product[]) => {
    setSelectedItems(products);
  };

  const handleShowDeliveryDetails = (deliveryDetails: DeliveryDetails) => {
    setSelectedDelivery(deliveryDetails);
  };

  const handleCloseModal = () => {
    setSelectedItems([]);
    setSelectedDelivery(null);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // Adjust the path to locate the correct document in the "user_orders" collection
      const ordersCollectionRef = query(collectionGroup(firestore, "user_orders"));
      const querySnapshot = await getDocs(ordersCollectionRef);
      const orderDocRef = querySnapshot.docs.find(doc => doc.id === orderId)?.ref;

      if (!orderDocRef) {
        console.error("Order document not found for orderId:", orderId);
        return;
      }

      // Update the document with the new status
      await updateDoc(orderDocRef, { status: newStatus });

      // Update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };


  return (
    <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-8">All Users Orders</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="overflow-x-auto h-[60vh] overflow-y-auto">
          <table className="table-auto w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 px-4 py-2">Order ID</th>
                {/* <th className="border border-gray-700 px-4 py-2">User ID</th> */}
                <th className="border border-gray-700 px-4 py-2">User Email</th>
                <th className="border border-gray-700 px-4 py-2">Contact</th>
                <th className="border border-gray-700 px-4 py-2">City</th>
                <th className="border border-gray-700 px-4 py-2">Status</th>
                <th className="border border-gray-700 px-4 py-2">Total Price</th>
                <th className="border border-gray-700 px-4 py-2">Items Count</th>
                <th className="border border-gray-700 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-800">
                  <td className="border border-gray-700 px-4 py-2">{order.orderId}</td>
                  {/* <td className="border border-gray-700 px-4 py-2">{order.userId}</td> */}
                  <td className="border border-gray-700 px-4 py-2">{order.userEmail}</td>
                  <td className="border border-gray-700 px-4 py-2">{order.contactNumber}</td>
                  <td className="border border-gray-700 px-4 py-2">{order.city}</td>
                  <td className="border border-gray-700 px-4 py-2">
                    <select
                      className="bg-gray-700 text-white px-2 py-1 rounded"
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="border border-gray-700 px-4 py-2">${order.totalPrice}</td>
                  <td className="border border-gray-700 px-4 py-2">{order.products.length}</td>
                  <td className="border border-gray-700 px-4 py-2 space-y-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={() => handleShowItems(order.products)}
                    >
                      Show Items
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      onClick={() => handleShowDeliveryDetails(order.deliveryDetails)}
                    >
                      Delivery Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Order Items */}
      {selectedItems.length > 0 && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 w-[90%] md:w-[50%]">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <ul className="list-disc ml-6 space-y-2">
              {selectedItems.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong> - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Delivery Details */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 w-[90%] md:w-[50%]">
            <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
            <p><strong>Address:</strong> {selectedDelivery.address}</p>
            <p><strong>City:</strong> {selectedDelivery.city}</p>
            <p><strong>Country:</strong> {selectedDelivery.country}</p>
            <p><strong>Phone:</strong> {selectedDelivery.phone}</p>
            <p><strong>Province:</strong> {selectedDelivery.province}</p>
            <p><strong>Street:</strong> {selectedDelivery.street}</p>
            <div className="mt-6 text-right">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// "use client";
// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   collectionGroup,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import { firestore } from "../../lib/firebase-config";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// interface DeliveryDetails {
//   address: string;
//   city: string;
//   country: string;
//   phone: string;
//   province: string;
//   street: string;
// }

// interface Order {
//   orderId: string;
//   userId: string;
//   status: string;
//   totalPrice: number;
//   products: Product[];
//   userEmail: string;
//   deliveryDetails: DeliveryDetails;
// }

// export default function Orders() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedItems, setSelectedItems] = useState<Product[]>([]);
//   const [selectedDelivery, setSelectedDelivery] = useState<DeliveryDetails | null>(null);

//   // Fetch all orders and user details
//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const ordersQuery = query(collectionGroup(firestore, "user_orders"));
//         const querySnapshot = await getDocs(ordersQuery);

//         const ordersData: Order[] = await Promise.all(
//           querySnapshot.docs.map(async (orderDoc) => {
//             const orderData = orderDoc.data();
//             const userId = orderDoc.ref.parent.parent?.id || "Unknown User";

//             // Fetch user email
//             const userDocRef = doc(firestore, "users", userId);
//             const userDocSnap = await getDoc(userDocRef);
//             const userEmail = userDocSnap.exists() ? userDocSnap.data()?.email || "No Email" : "No Email";

//             return {
//               orderId: orderDoc.id,
//               userId,
//               userEmail,
//               status: orderData.status || "Unknown",
//               totalPrice: orderData.totalPrice || 0,
//               products: orderData.products || [],
//               deliveryDetails: orderData.deliveryDetails || {},
//             } as Order;
//           })
//         );

//         setOrders(ordersData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   }, []);

//   const handleShowItems = (products: Product[]) => {
//     setSelectedItems(products);
//   };

//   const handleShowDeliveryDetails = (deliveryDetails: DeliveryDetails) => {
//     setSelectedDelivery(deliveryDetails);
//   };

//   const handleCloseModal = () => {
//     setSelectedItems([]);
//     setSelectedDelivery(null);
//   };

//   return (
//     <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
//       <h1 className="text-3xl font-bold mb-8">All Users' Orders</h1>
//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : orders.length === 0 ? (
//         <p className="text-center">No orders found.</p>
//       ) : (
//         <div className="overflow-x-auto h-[60vh] overflow-y-auto">
//           <table className="table-auto w-full border-collapse border border-gray-700">
//             <thead>
//               <tr className="bg-gray-800">
//                 <th className="border border-gray-700 px-4 py-2">Order ID</th>
//                 <th className="border border-gray-700 px-4 py-2">User ID</th>
//                 <th className="border border-gray-700 px-4 py-2">User Email</th>
//                 <th className="border border-gray-700 px-4 py-2">Status</th>
//                 <th className="border border-gray-700 px-4 py-2">Total Price</th>
//                 <th className="border border-gray-700 px-4 py-2">Items Count</th>
//                 <th className="border border-gray-700 px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.orderId} className="hover:bg-gray-800">
//                   <td className="border border-gray-700 px-4 py-2">{order.orderId}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.userId}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.userEmail}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.status}</td>
//                   <td className="border border-gray-700 px-4 py-2">${order.totalPrice}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.products.length}</td>
//                   <td className="border border-gray-700 px-4 py-2 space-y-2">
//                     <button
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                       onClick={() => handleShowItems(order.products)}
//                     >
//                       Show Items
//                     </button>
//                     <button
//                       className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//                       onClick={() => handleShowDeliveryDetails(order.deliveryDetails)}
//                     >
//                       Delivery Details
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal for Order Items */}
//       {selectedItems.length > 0 && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 w-[90%] md:w-[50%]">
//             <h2 className="text-xl font-bold mb-4">Order Items</h2>
//             <ul className="list-disc ml-6 space-y-2">
//               {selectedItems.map((item) => (
//                 <li key={item.id}>
//                   <strong>{item.name}</strong> - ${item.price} x {item.quantity}
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-6 text-right">
//               <button
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//                 onClick={handleCloseModal}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal for Delivery Details */}
//       {selectedDelivery && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 w-[90%] md:w-[50%]">
//             <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
//             <p><strong>Address:</strong> {selectedDelivery.address}</p>
//             <p><strong>City:</strong> {selectedDelivery.city}</p>
//             <p><strong>Country:</strong> {selectedDelivery.country}</p>
//             <p><strong>Phone:</strong> {selectedDelivery.phone}</p>
//             <p><strong>Province:</strong> {selectedDelivery.province}</p>
//             <p><strong>Street:</strong> {selectedDelivery.street}</p>
//             <div className="mt-6 text-right">
//               <button
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//                 onClick={handleCloseModal}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";
// import { useEffect, useState } from "react";
// import { collectionGroup, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
// import { firestore } from "../../lib/firebase-config";
// // import { doc, getDoc, getDocs, collectionGroup } from "firebase/firestore";


// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// interface Order {
//   orderId: string;
//   userId: string;
//   status: string;
//   totalPrice: number;
//   products: Product[];
//   deliveryDetails: Record<string, string>;
//   paymentMethod: string;
//   datetime: string;
//   userEmail: string;
// }

// export default function Orders() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const ordersQuery = collectionGroup(firestore, "user_orders");
//         const querySnapshot = await getDocs(ordersQuery);

//         const ordersData: Order[] = [];
//         for (const docSnap of querySnapshot.docs) {
//           const data = docSnap.data();
//           const userId = docSnap.ref.parent.parent?.id || "Unknown User";
//           const userEmail = await fetchUserEmail(userId);

//           ordersData.push({
//             orderId: docSnap.id,
//             userId,
//             userEmail,
//             status: data.status || "Unknown",
//             totalPrice: data.totalPrice || 0,
//             products: data.products || [],
//             deliveryDetails: data.deliveryDetails || {},
//             paymentMethod: data.paymentMethod || "Unknown",
//             datetime: data.datetime?.toDate().toLocaleString() || "Unknown",
//           });
//         }

//         setOrders(ordersData);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     async function fetchUserEmail(userId: string): Promise<string> {
//       try {
//         const userRef = doc(firestore, "users", userId); // Correct reference to a specific document
//         const userSnapshot = await getDoc(userRef); // Use getDoc for a single document
//         return userSnapshot.exists() ? (userSnapshot.data()?.email || "No Email") : "No Email";
//       } catch (error) {
//         console.error("Error fetching user email:", error);
//         return "No Email";
//       }
//     }
    

//     fetchOrders();
//   }, []);

//   const updateOrderStatus = async (orderId: string, userId: string, newStatus: string) => {
//     try {
//       const orderRef = doc(firestore, `orders/${userId}/user_orders/${orderId}`);
//       await updateDoc(orderRef, { status: newStatus });
//       alert(`Order ${orderId} status updated to ${newStatus}`);
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.orderId === orderId ? { ...order, status: newStatus } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error updating order status:", error);
//     }
//   };

//   return (
//     <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
//       <h1 className="text-3xl font-bold mb-4">All Orders</h1>

//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : orders.length === 0 ? (
//         <p className="text-center">No orders found.</p>
//       ) : (
//         <div className="overflow-x-auto h-[60vh] overflow-y-auto">
//           <table className="table-auto w-full border-collapse border border-gray-700">
//             <thead>
//               <tr className="bg-gray-800">
//                 <th className="border border-gray-700 px-4 py-2">Order ID</th>
//                 <th className="border border-gray-700 px-4 py-2">User Email</th>
//                 <th className="border border-gray-700 px-4 py-2">Status</th>
//                 <th className="border border-gray-700 px-4 py-2">Total Price</th>
//                 <th className="border border-gray-700 px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.orderId} className="hover:bg-gray-800">
//                   <td className="border border-gray-700 px-4 py-2">{order.orderId}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.userEmail}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.status}</td>
//                   <td className="border border-gray-700 px-4 py-2">${order.totalPrice}</td>
//                   <td className="border border-gray-700 px-4 py-2">
//                     <button
//                       className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
//                       onClick={() => updateOrderStatus(order.orderId, order.userId, "Completed")}
//                     >
//                       Mark as Completed
//                     </button>
//                     <button
//                       className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
//                       onClick={() => updateOrderStatus(order.orderId, order.userId, "Pending")}
//                     >
//                       Mark as Pending
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";
// import { useEffect, useState } from "react";
// import { collection, getDocs, query, collectionGroup, updateDoc, doc } from "firebase/firestore";
// import { firestore } from "../../lib/firebase-config";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   available: boolean; // Track availability
// }

// interface Order {
//   orderId: string;
//   userId: string;
//   status: string;
//   totalPrice: number;
//   products: Product[];
//   userEmail: string;
//   userContact: string;
// }

// export default function Orders() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [selectedItems, setSelectedItems] = useState<Product[]>([]);

//   // Fetch all orders and user details
//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const ordersQuery = query(collectionGroup(firestore, "user_orders"));
//         const querySnapshot = await getDocs(ordersQuery);

//         const ordersData: Order[] = await Promise.all(
//           querySnapshot.docs.map(async (doc) => {
//             const data = doc.data();
//             const userId = doc.ref.parent.parent?.id || "Unknown User";

//             // Fetch user details
//             const userRef = collection(firestore, "users");
//             const userSnapshot = await getDocs(userRef);
//             const userDetails = userSnapshot.docs.find((userDoc) => userDoc.id === userId)?.data() || {};

//             return {
//               orderId: doc.id,
//               userId,
//               userEmail: userDetails.email || "No Email",
//               userContact: userDetails.contact || "No Contact",
//               ...data,
//             } as Order;
//           })
//         );

//         setOrders(ordersData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   }, []);

//   const handleShowDetails = (order: Order) => {
//     setSelectedOrder(order);
//   };

//   const handleCloseDetails = () => {
//     setSelectedOrder(null);
//     setSelectedItems([]);
//   };

//   const handleShowItems = (products: Product[]) => {
//     setSelectedItems(products);
//   };

//   const toggleAvailability = (product: Product) => {
//     product.available = !product.available;
//     setSelectedItems([...selectedItems]); // Update state
//   };

//   const finishOrder = async (order: Order) => {
//     try {
//       const orderRef = doc(firestore, `users/${order.userId}/user_orders/${order.orderId}`);
//       await updateDoc(orderRef, { status: "Finished" });
//       alert("Order marked as finished!");
//     } catch (error) {
//       console.error("Error updating order status:", error);
//     }
//   };

//   return (
//     <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
//       <h1 className="text-3xl font-bold mb-8">All Users' Orders</h1>
//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : orders.length === 0 ? (
//         <p className="text-center">No orders found.</p>
//       ) : (
//         <div className="overflow-x-auto h-[60vh] overflow-y-auto">
//           <table className="table-auto w-full border-collapse border border-gray-700">
//             <thead>
//               <tr className="bg-gray-800">
//                 <th className="border border-gray-700 px-4 py-2">Order ID</th>
//                 <th className="border border-gray-700 px-4 py-2">User ID</th>
//                 <th className="border border-gray-700 px-4 py-2">User Email</th>
//                 <th className="border border-gray-700 px-4 py-2">Contact</th>
//                 <th className="border border-gray-700 px-4 py-2">Status</th>
//                 <th className="border border-gray-700 px-4 py-2">Total Price</th>
//                 <th className="border border-gray-700 px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.orderId} className="hover:bg-gray-800">
//                   <td className="border border-gray-700 px-4 py-2">{order.orderId}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.userId}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.userEmail}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.userContact}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.status}</td>
//                   <td className="border border-gray-700 px-4 py-2">${order.totalPrice}</td>
//                   <td className="border border-gray-700 px-4 py-2 space-y-2">
//                     <button
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                       onClick={() => handleShowDetails(order)}
//                     >
//                       Show Details
//                     </button>
//                     <button
//                       className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//                       onClick={() => handleShowItems(order.products)}
//                     >
//                       List of Order Items
//                     </button>
//                     <button
//                       className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//                       onClick={() => finishOrder(order)}
//                     >
//                       Finish
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal for Order Details */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 w-[90%] md:w-[50%]">
//             <h2 className="text-xl font-bold mb-4">Order Details</h2>
//             <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
//             <p><strong>User ID:</strong> {selectedOrder.userId}</p>
//             <p><strong>User Email:</strong> {selectedOrder.userEmail}</p>
//             <p><strong>Contact:</strong> {selectedOrder.userContact}</p>
//             <p><strong>Status:</strong> {selectedOrder.status}</p>
//             <p><strong>Total Price:</strong> ${selectedOrder.totalPrice}</p>
//             <div className="mt-6 text-right">
//               <button
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//                 onClick={handleCloseDetails}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal for Order Items */}
//       {selectedItems.length > 0 && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 w-[90%] md:w-[50%]">
//             <h2 className="text-xl font-bold mb-4">Order Items</h2>
//             <ul className="list-disc ml-6 space-y-2">
//               {selectedItems.map((item) => (
//                 <li key={item.id}>
//                   <strong>{item.name}</strong> - ${item.price} x {item.quantity}
//                   <button
//                     className={`ml-4 px-4 py-1 rounded ${
//                       item.available ? "bg-green-500" : "bg-red-500"
//                     } text-white`}
//                     onClick={() => toggleAvailability(item)}
//                   >
//                     {item.available ? "Available" : "Not Available"}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-6 text-right">
//               <button
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//                 onClick={handleCloseDetails}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";
// import { useEffect, useState } from "react";
// import { collection, getDocs, query, collectionGroup } from "firebase/firestore";
// import { firestore } from "../../lib/firebase-config";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// interface Order {
//   orderId: string;
//   userId: string;
//   status: string;
//   totalPrice: number;
//   products: Product[];
// }

// export default function Orders() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // State for selected order

//   // Fetch all users' orders
//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const ordersQuery = query(collectionGroup(firestore, "user_orders")); // Fetch all user_orders subcollections
//         const querySnapshot = await getDocs(ordersQuery);

//         const ordersData: Order[] = querySnapshot.docs.map((doc) => {
//           const data = doc.data();
//           return {
//             orderId: doc.id,
//             userId: doc.ref.parent.parent?.id || "Unknown User", // Get user UID
//             ...data,
//           } as Order;
//         });

//         setOrders(ordersData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   }, []);

//   const handleShowDetails = (order: Order) => {
//     setSelectedOrder(order); // Set the selected order
//   };

//   const handleCloseDetails = () => {
//     setSelectedOrder(null); // Clear the selected order
//   };

//   return (
//     <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
//       <h1 className="text-3xl font-bold mb-8">All Users' Orders</h1>
//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : orders.length === 0 ? (
//         <p className="text-center">No orders found.</p>
//       ) : (
//         <div className="overflow-x-auto h-[60vh] overflow-y-auto">
//           <table className="table-auto w-full border-collapse border border-gray-700">
//             <thead>
//               <tr className="bg-gray-800">
//                 <th className="border border-gray-700 px-4 py-2">Order ID</th>
//                 <th className="border border-gray-700 px-4 py-2">User ID</th>
//                 <th className="border border-gray-700 px-4 py-2">Status</th>
//                 <th className="border border-gray-700 px-4 py-2">Total Price</th>
//                 <th className="border border-gray-700 px-4 py-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.orderId} className="hover:bg-gray-800">
//                   <td className="border border-gray-700 px-4 py-2">{order.orderId}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.userId}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.status}</td>
//                   <td className="border border-gray-700 px-4 py-2">{order.totalPrice}</td>
//                   <td className="border border-gray-700 px-4 py-2">
//                     <button
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                       onClick={() => handleShowDetails(order)}
//                     >
//                       Show Details
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal for Order Details */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 w-[90%] md:w-[50%]">
//             <h2 className="text-xl font-bold mb-4">Order Details</h2>
//             <p>
//               <strong>Order ID:</strong> {selectedOrder.orderId}
//             </p>
//             <p>
//               <strong>User ID:</strong> {selectedOrder.userId}
//             </p>
//             <p>
//               <strong>Status:</strong> {selectedOrder.status}
//             </p>
//             <p>
//               <strong>Total Price:</strong> ${selectedOrder.totalPrice}
//             </p>
//             <div className="mt-4">
//               <h3 className="font-bold">Products:</h3>
//               <ul className="list-disc ml-6">
//                 {selectedOrder.products.map((product, index) => (
//                   <li key={index}>
//                     <strong>{product.name}</strong> - ${product.price} x{" "}
//                     {product.quantity}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="mt-6 text-right">
//               <button
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//                 onClick={handleCloseDetails}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
