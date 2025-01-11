"use client";
import { useEffect, useState } from "react";

interface User {
  uid: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch users from API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/fetchUsers");
        const data: User[] = await response.json();
        setUsers(data);
        setLoadingUsers(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoadingUsers(false);
      }
    }

    async function fetchProducts() {
      try {
        const response = await fetch("/api/fetchProducts");
        const data: Product[] = await response.json();
        setProducts(data);
        setLoadingProducts(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoadingProducts(false);
      }
    }

    fetchUsers();
    fetchProducts();
  }, []);

  return (
    <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <p className="text-lg font-semibold">Total Users: {users.length}</p>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Products</h2>
          {loadingProducts ? (
            <p>Loading products...</p>
          ) : (
            <p className="text-lg font-semibold">Total Products: {products.length}</p>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Categories</h2>
          {loadingProducts ? (
            <p>Loading products...</p>
          ) : (
            <p className="text-lg font-semibold">Total Categories: {products.length}</p>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Sub Categories</h2>
          {loadingProducts ? (
            <p>Loading products...</p>
          ) : (
            <p className="text-lg font-semibold">Total Sub Categories: {products.length}</p>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Orders</h2>
          {loadingProducts ? (
            <p>Loading products...</p>
          ) : (
            <p className="text-lg font-semibold">Total Orders: {products.length}</p>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">CheckOut</h2>
          {loadingProducts ? (
            <p>Loading products...</p>
          ) : (
            <p className="text-lg font-semibold">Total CheckOut: {products.length}</p>
          )}
        </div>
      </div>
    </div>
  );
}
