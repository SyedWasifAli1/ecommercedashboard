/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "../lib/firebase-config";

interface User {
  uid: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Category {
  id: string;
  name: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<number>(0);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [categoriesCount, setCategoriesCount] = useState<number>(0); // Categories count state
  const [allSubCategoriesCount, setAllSubCategoriesCount] = useState<number>(0); // Total subcategories count across all categories
  const [ordersCount, setOrdersCount] = useState<number>(0); // Total orders count from user_orders
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(true); // Subcategories loading state
  const [loadingOrders, setLoadingOrders] = useState(true); // Orders loading state

  // Fetch users, products, categories, subcategories, and orders
  useEffect(() => {
    // async function fetchUsers() {
    //   try {
    //     const response = await fetch("/api/fetchUsers");
    //     const data: User[] = await response.json();
    //     setUsers(data);
    //     setLoadingUsers(false);
    //   } catch (error) {
    //     console.error("Error fetching users:", error);
    //     setLoadingUsers(false);
    //   }
    // }
    async function fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(firestore, "customers")); // Replace "customers" with your collection name
        setUsers(querySnapshot.size); // Get the count of documents in the customers collection
        setLoadingUsers(false);
      } catch (error) {
        console.error("Error fetching customers count:", error);
        setLoadingUsers(false);
      }
    }
    
    async function fetchProductsCount() {
      try {
        const querySnapshot = await getDocs(collection(firestore, "products"));
        setProductsCount(querySnapshot.size); // Get the count of documents in the products collection
        setLoadingProducts(false);
      } catch (error) {
        console.error("Error fetching products count:", error);
        setLoadingProducts(false);
      }
    }


    async function fetchCategoriesCount() {
      try {
        const querySnapshot = await getDocs(collection(firestore, "category"));
        setCategoriesCount(querySnapshot.size); // Get the count of documents in the category collection
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories count:", error);
        setLoadingCategories(false);
      }
    }

    async function fetchAllSubCategoriesCount() {
      try {
        const categorySnapshot = await getDocs(collection(firestore, "category"));
        let totalSubCategories = 0;

        // For each category, fetch its subcategories
        for (const categoryDoc of categorySnapshot.docs) {
          const categoryId = categoryDoc.id;
          const subCategorySnapshot = await getDocs(collection(firestore, `category/${categoryId}/sub_categories`));
          totalSubCategories += subCategorySnapshot.size; // Add the count of subcategories for this category
        }

        setAllSubCategoriesCount(totalSubCategories); // Set the total subcategories count
        setLoadingSubCategories(false);
      } catch (error) {
        console.error("Error fetching subcategories count:", error);
        setLoadingSubCategories(false);
      }
    }

    async function fetchOrdersCount() {
      try {
        const categorySnapshot = await getDocs(collection(firestore, "orders"));
        let totalSubCategories = 0;

        // For each category, fetch its subcategories
        for (const categoryDoc of categorySnapshot.docs) {
          const categoryId = categoryDoc.id;
          const subCategorySnapshot = await getDocs(collection(firestore, `orders/${categoryId}/user_orders`));
          totalSubCategories += subCategorySnapshot.size; // Add the count of subcategories for this category
        }

        setOrdersCount(totalSubCategories); // Set the total subcategories count
        setLoadingSubCategories(false);
      } catch (error) {
        console.error("Error fetching subcategories count:", error);
        setLoadingSubCategories(false);
      }
    }
    
    
    

    fetchUsers();
    fetchProductsCount();
    fetchCategoriesCount();
    fetchAllSubCategoriesCount(); // Fetch total subcategories count across all categories
    fetchOrdersCount(); // Fetch total orders count from user_orders subcollections
  }, []);

  return (
    <div className="h-[80vh] bg-white text-black p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <p className="text-lg font-semibold">Total Users: {users}</p>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Products</h2>
          {loadingProducts ? (
            <p>Loading products...</p>
          ) : (
            <p className="text-lg font-semibold">Total Products: {productsCount}</p>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Categories</h2>
          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : (
            <p className="text-lg font-semibold">Total Categories: {categoriesCount}</p>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Sub Categories</h2>
          {loadingSubCategories ? (
            <p>Loading subcategories...</p>
          ) : (
            <p className="text-lg font-semibold">Total Sub Categories: {allSubCategoriesCount}</p>
          )}
        </div>
      
      </div>
    </div>
  );
}



