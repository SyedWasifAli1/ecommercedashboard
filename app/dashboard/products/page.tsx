"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../lib/firebase-config";
import Image from "next/image";

interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    sub_category: string;
    images1?: string[]; // Updated to an array
  }
  

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]); // Explicitly type as an array of Product
  const [loading, setLoading] = useState(true);

  // Fetch products from Firestore
  useEffect(() => {
    async function fetchProducts() {
        try {
            const querySnapshot = await getDocs(collection(firestore, "products"));
            const productsData: Product[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as Omit<Product, "id">;
                return {
                  id: doc.id,
                  ...data,
                  images1: data.images1 || [], // Ensure it's an array even if missing
                };
              });
            setProducts(productsData);
            setLoading(false);
          } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-8">Products List</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <div className="overflow-x-auto h-[60vh] overflow-y-auto">
          <table className="table-auto w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 px-4 py-2">Thumbnail</th>
                <th className="border border-gray-700 px-4 py-2">SKU</th>
                <th className="border border-gray-700 px-4 py-2">Name</th>
                <th className="border border-gray-700 px-4 py-2">Price</th>
                <th className="border border-gray-700 px-4 py-2">Stock</th>
                <th className="border border-gray-700 px-4 py-2">Category</th>
                <th className="border border-gray-700 px-4 py-2">Sub-Category</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-800">

<td className="border border-gray-700 px-4 py-2">
  {product.images1 && product.images1.length > 0 ? (
    <Image
      src={`data:image/png;base64,${product.images1[0]}`} // Convert byte array/Base64 string to valid image source
      alt="Thumbnail"
      width={64} // Adjust as needed
      height={64} // Adjust as needed
      className="object-cover rounded"
      quality={75} // Adjust quality to optimize bandwidth
    />
  ) : (
    <span>No Image</span>
  )}
</td>



                  <td className="border border-gray-700 px-4 py-2">{product.sku}</td>
                  <td className="border border-gray-700 px-4 py-2">{product.name}</td>
                  <td className="border border-gray-700 px-4 py-2">{product.price}</td>
                  <td className="border border-gray-700 px-4 py-2">{product.stock}</td>
                  <td className="border border-gray-700 px-4 py-2">{product.category}</td>
                  <td className="border border-gray-700 px-4 py-2">{product.sub_category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
