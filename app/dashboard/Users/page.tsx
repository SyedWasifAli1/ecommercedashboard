"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../lib/firebase-config"; // Update the path to your Firebase config

interface Customer {
  id: string;
  email: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch customers from Firestore
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const querySnapshot = await getDocs(collection(firestore, "customers")); // Fetch 'customers' collection
        const customerData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Get document ID
          email: doc.data().email, // Get email from document data
        }));
        setCustomers(customerData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  return (
    <div className="h-[80vh]  text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-4">Customer List</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <p className="mb-4">Total Customers: {customers.length}</p>
          {customers.length === 0 ? (
            <p className="text-center">No customers found.</p>
          ) : (
            <div className="overflow-x-auto h-[60vh] overflow-y-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{customer.id}</td>
                      <td className="border border-gray-300 px-4 py-2">{customer.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}


// "use client";
// import { useEffect, useState } from "react";

// interface User {
//   uid: string;
//   email: string;
//   createdAt: string;
//   lastSignInTime: string;
// }

// export default function Users() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch users from API
//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         const response = await fetch("/api/fetchUsers");
//         const data: User[] = await response.json();
//         setUsers(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         setLoading(false);
//       }
//     }

//     fetchUsers();
//   }, []);

//   return (
//     <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
//       <h1 className="text-3xl font-bold mb-8">User List</h1>
//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : users.length === 0 ? (
//         <p className="text-center">No users found.</p>
//       ) : (
//         <div className="overflow-x-auto h-[60vh] overflow-y-auto">
//           <table className="table-auto w-full border-collapse border border-gray-700">
//             <thead>
//               <tr className="bg-gray-800">
//                 <th className="border border-gray-700 px-4 py-2">UID</th>
//                 <th className="border border-gray-700 px-4 py-2">Email</th>
//                 <th className="border border-gray-700 px-4 py-2">Created At</th>
//                 <th className="border border-gray-700 px-4 py-2">Last Sign-In</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user.uid} className="hover:bg-gray-800">
//                   <td className="border border-gray-700 px-4 py-2">{user.uid}</td>
//                   <td className="border border-gray-700 px-4 py-2">{user.email}</td>
//                   <td className="border border-gray-700 px-4 py-2">{user.createdAt}</td>
//                   <td className="border border-gray-700 px-4 py-2">{user.lastSignInTime}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
