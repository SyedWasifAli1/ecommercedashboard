// "use client";

// import { useState } from "react";
// import { collection, addDoc } from "firebase/firestore";
// import { firestore } from "../../lib/firebase-config";
// import { v4 as uuidv4 } from "uuid";

// export default function AddProduct() {
//   const [product, setProduct] = useState({
//     sku: "",
//     name: "",
//     price: "",
//     stock: "",
//     category: "",
//     sub_category: "",
//   });
//   const [images, setImages] = useState<FileList | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImages(e.target.files);
//     }
//   };

//   // Function to convert an image to a base64-encoded byte array
//   const convertToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//       reader.readAsDataURL(file);
//     });
//   };

//   const uploadImages = async (): Promise<string[]> => {
//     if (!images) return [];

//     const imageUrls: string[] = [];
//     for (const file of Array.from(images)) {
//       try {
//         const base64Image = await convertToBase64(file);
//         imageUrls.push(base64Image); // Store base64 data (image byte array) in Firestore
//       } catch (error) {
//         console.error("Error converting image:", file.name, error);
//         setError(`Failed to convert image: ${file.name}`);
//       }
//     }
//     return imageUrls;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const imageUrls = await uploadImages();

//       const productData = {
//         ...product,
//         price: parseFloat(product.price), // Convert price to number
//         stock: parseInt(product.stock), // Convert stock to number
//         images: imageUrls, // Store base64 image byte arrays in Firestore
//       };

//       await addDoc(collection(firestore, "products"), productData);
//       setSuccess("Product added successfully!");
//       setProduct({
//         sku: "",
//         name: "",
//         price: "",
//         stock: "",
//         category: "",
//         sub_category: "",
//       });
//       setImages(null);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       setError("Failed to add product. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
//       <h1 className="text-3xl font-bold mb-8">Add Product</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       {success && <p className="text-green-500">{success}</p>}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="sku" className="block text-sm font-medium mb-1">
//             SKU
//           </label>
//           <input
//             type="text"
//             id="sku"
//             name="sku"
//             value={product.sku}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="name" className="block text-sm font-medium mb-1">
//             Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={product.name}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="price" className="block text-sm font-medium mb-1">
//             Price
//           </label>
//           <input
//             type="number"
//             id="price"
//             name="price"
//             value={product.price}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="stock" className="block text-sm font-medium mb-1">
//             Stock
//           </label>
//           <input
//             type="number"
//             id="stock"
//             name="stock"
//             value={product.stock}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="category" className="block text-sm font-medium mb-1">
//             Category
//           </label>
//           <input
//             type="text"
//             id="category"
//             name="category"
//             value={product.category}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="sub_category" className="block text-sm font-medium mb-1">
//             Sub-Category
//           </label>
//           <input
//             type="text"
//             id="sub_category"
//             name="sub_category"
//             value={product.sub_category}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="images" className="block text-sm font-medium mb-1">
//             Product Images
//           </label>
//           <input
//             type="file"
//             id="images"
//             multiple
//             accept="image/*"
//             onChange={handleImageChange}
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Adding..." : "Add Product"}
//         </button>
//       </form>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { collection, addDoc } from "firebase/firestore";
// import { firestore } from "../../lib/firebase-config";

// export default function AddProduct() {
//   const [product, setProduct] = useState({
//     sku: "",
//     name: "",
//     price: "",
//     stock: "",
//     category: "",
//     sub_category: "",
//   });
//   const [images, setImages] = useState<FileList | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImages(e.target.files);
//     }
//   };

//   const readImagesAsBytes = async (): Promise<string[]> => {
//     if (!images) return [];

//     const imagePromises = Array.from(images).map((file) => {
//       return new Promise<string>((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           if (reader.result) {
//             resolve(reader.result.toString()); // Convert to base64 string
//           } else {
//             reject("Failed to read file.");
//           }
//         };
//         reader.onerror = () => reject(reader.error);
//         reader.readAsDataURL(file); // Read file as base64 string
//       });
//     });

//     return Promise.all(imagePromises);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const imageBytes = await readImagesAsBytes();

//       if (!imageBytes || imageBytes.length === 0) {
//         throw new Error("No images uploaded.");
//       }

//       const productData = {
//         ...product,
//         price: parseFloat(product.price), // Convert price to number
//         stock: parseInt(product.stock), // Convert stock to number
//         images: imageBytes, // Store base64 strings in Firestore
//       };

//       await addDoc(collection(firestore, "products"), productData);
//       setSuccess("Product added successfully!");
//       setProduct({
//         sku: "",
//         name: "",
//         price: "",
//         stock: "",
//         category: "",
//         sub_category: "",
//       });
//       setImages(null);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       // setError("Failed to add product. " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
//       <h1 className="text-3xl font-bold mb-8">Add Product</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       {success && <p className="text-green-500">{success}</p>}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="sku" className="block text-sm font-medium mb-1">
//             SKUr
//           </label>
//           <input
//             type="text"
//             id="sku"
//             name="sku"
//             value={product.sku}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="name" className="block text-sm font-medium mb-1">
//             Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={product.name}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="price" className="block text-sm font-medium mb-1">
//             Price
//           </label>
//           <input
//             type="number"
//             id="price"
//             name="price"
//             value={product.price}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="stock" className="block text-sm font-medium mb-1">
//             Stock
//           </label>
//           <input
//             type="number"
//             id="stock"
//             name="stock"
//             value={product.stock}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="category" className="block text-sm font-medium mb-1">
//             Category
//           </label>
//           <input
//             type="text"
//             id="category"
//             name="category"
//             value={product.category}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="sub_category" className="block text-sm font-medium mb-1">
//             Sub-Category
//           </label>
//           <input
//             type="text"
//             id="sub_category"
//             name="sub_category"
//             value={product.sub_category}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="images" className="block text-sm font-medium mb-1">
//             Product Images
//           </label>
//           <input
//             type="file"
//             id="images"
//             multiple
//             accept="image/*"
//             onChange={handleImageChange}
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Adding..." : "Add Product"}
//         </button>
//       </form>
//     </div>
//   );
// }
// "use client";

// import { useState } from "react";
// import { collection, addDoc } from "firebase/firestore";
// import { firestore } from "../../lib/firebase-config";

// export default function AddProduct() {
//   const [product, setProduct] = useState({
//     sku: "",
//     name: "",
//     price: "",
//     stock: "",
//     category: "",
//     sub_category: "",
//   });
//   const [images, setImages] = useState<FileList | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImages(e.target.files);
//     }
//   };

//   const readImagesAsBytes = async (): Promise<string[]> => {
//     if (!images) return [];

//     const imagePromises = Array.from(images).map((file) => {
//       return new Promise<string>((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           if (reader.result) {
//             resolve(reader.result.toString()); // base64 string
//           }
//         };
//         reader.onerror = () => reject(reader.error);
//         reader.readAsDataURL(file); // Read file as base64 data URL
//       });
//     });

//     return Promise.all(imagePromises);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const imageBytes = await readImagesAsBytes();

//       const productData = {
//         ...product,
//         price: parseFloat(product.price), // Convert price to number
//         stock: parseInt(product.stock), // Convert stock to number
//         images: imageBytes, // Store base64 strings
//       };

//       await addDoc(collection(firestore, "products"), productData);
//       setSuccess("Product added successfully!");
//       setProduct({
//         sku: "",
//         name: "",
//         price: "",
//         stock: "",
//         category: "",
//         sub_category: "",
//       });
//       setImages(null);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       setError("Failed to add product.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
//       <h1 className="text-3xl font-bold mb-8">Add Product</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       {success && <p className="text-green-500">{success}</p>}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="sku" className="block text-sm font-medium mb-1">
//             SKU
//           </label>
//           <input
//             type="text"
//             id="sku"
//             name="sku"
//             value={product.sku}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="name" className="block text-sm font-medium mb-1">
//             Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={product.name}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="price" className="block text-sm font-medium mb-1">
//             Price
//           </label>
//           <input
//             type="number"
//             id="price"
//             name="price"
//             value={product.price}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="stock" className="block text-sm font-medium mb-1">
//             Stock
//           </label>
//           <input
//             type="number"
//             id="stock"
//             name="stock"
//             value={product.stock}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="category" className="block text-sm font-medium mb-1">
//             Category
//           </label>
//           <input
//             type="text"
//             id="category"
//             name="category"
//             value={product.category}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="sub_category" className="block text-sm font-medium mb-1">
//             Sub-Category
//           </label>
//           <input
//             type="text"
//             id="sub_category"
//             name="sub_category"
//             value={product.sub_category}
//             onChange={handleChange}
//             required
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="images" className="block text-sm font-medium mb-1">
//             Product Images
//           </label>
//           <input
//             type="file"
//             id="images"
//             multiple
//             accept="image/*"
//             onChange={handleImageChange}
//             className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Adding..." : "Add Product"}
//         </button>
//       </form>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { firestore } from "../../lib/firebase-config";
// import Image from "next/image";
// import Link from 'next/link';

// interface Product {
//     id: string;
//     sku: string;
//     name: string;
//     price: number;
//     stock: number;
//     category: string;
//     sub_category: string;
//     images1?: string[]; // Updated to an array
//   }
  

// export default function Products() {
//   const [products, setProducts] = useState<Product[]>([]); // Explicitly type as an array of Product
//   const [loading, setLoading] = useState(true);

//   // Fetch products from Firestore
//   useEffect(() => {
//     async function fetchProducts() {
//         try {
//             const querySnapshot = await getDocs(collection(firestore, "products"));
//             const productsData: Product[] = querySnapshot.docs.map((doc) => {
//                 const data = doc.data() as Omit<Product, "id">;
//                 return {
//                   id: doc.id,
//                   ...data,
//                   images1: data.images1 || [], // Ensure it's an array even if missing
//                 };
//               });
//             setProducts(productsData);
//             setLoading(false);
//           } catch (error) {
//         console.error("Error fetching products:", error);
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   return (
//     <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
//       <h1 className="text-3xl font-bold mb-8">Products List</h1>
//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : products.length === 0 ? (
//         <p className="text-center">No products found.</p>
//       ) : (
//         <div className="overflow-x-auto h-[60vh] overflow-y-auto">
//           <table className="table-auto w-full border-collapse border border-gray-700">
//             <thead>
//               <tr className="bg-gray-800">
//                 <th className="border border-gray-700 px-4 py-2">Thumbnail</th>
//                 <th className="border border-gray-700 px-4 py-2">SKU</th>
//                 <th className="border border-gray-700 px-4 py-2">Name</th>
//                 <th className="border border-gray-700 px-4 py-2">Price</th>
//                 <th className="border border-gray-700 px-4 py-2">Stock</th>
//                 <th className="border border-gray-700 px-4 py-2">Category</th>
//                 <th className="border border-gray-700 px-4 py-2">Sub-Category</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product) => (
//                 <tr key={product.id} className="hover:bg-gray-800">

// <td className="border border-gray-700 px-4 py-2">
//   {product.images1 && product.images1.length > 0 ? (
//     <Image
//       src={`data:image/png;base64,${product.images1[0]}`} // Convert byte array/Base64 string to valid image source
//       alt="Thumbnail"
//       width={64} // Adjust as needed
//       height={64} // Adjust as needed
//       className="object-cover rounded"
//       quality={75} // Adjust quality to optimize bandwidth
//     />
//   ) : (
//     <span>No Image</span>
//   )}
// </td>



//                   <td className="border border-gray-700 px-4 py-2">{product.sku}</td>
//                   <td className="border border-gray-700 px-4 py-2">{product.name}</td>
//                   <td className="border border-gray-700 px-4 py-2">{product.price}</td>
//                   <td className="border border-gray-700 px-4 py-2">{product.stock}</td>
//                   <td className="border border-gray-700 px-4 py-2">{product.category}</td>
//                   <td className="border border-gray-700 px-4 py-2">{product.sub_category}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
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
  images1?: string[]; // Array of image Base64 strings
}

interface Category {
  id: string;
  name: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchCategories = async () => {
    const categorySnapshot = await getDocs(collection(firestore, "category"));
    const categoryData: Category[] = categorySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setCategories(categoryData);

    const subCategoryData: Category[] = [];
    for (const category of categorySnapshot.docs) {
      const subCategorySnapshot = await getDocs(
        collection(firestore, "category", category.id, "sub_categories")
      );
      subCategorySnapshot.docs.forEach((subDoc) => {
        subCategoryData.push({ id: subDoc.id, name: subDoc.data().name });
      });
    }
    setSubCategories(subCategoryData);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "products"));
      const productsData: Product[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Product, "id">;
        return {
          id: doc.id,
          ...data,
          images1: data.images1 || [], // Default to an empty array if missing
        };
      });
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, "products", id));
      setProducts((prev) => prev.filter((product) => product.id !== id));
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      const { id, ...data } = editingProduct; // Exclude `id`
      await updateDoc(doc(firestore, "products", id), data);
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? editingProduct : product))
      );
      setEditingProduct(null);
      alert("Product updated successfully.");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const resolveCategoryName = (id: string) =>
    categories.find((category) => category.id === id)?.name || "Unknown";

  const resolveSubCategoryName = (id: string) =>
    subCategories.find((subCategory) => subCategory.id === id)?.name || "Unknown";

  return (
    <div className="h-[80vh] bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Products List</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <div className="overflow-x-auto h-[60vh] overflow-y-auto">
          <table className="table-auto w-full border-collapse border border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="border border-gray-700 px-4 py-2">Thumbnail</th>
                <th className="border border-gray-700 px-4 py-2">SKU</th>
                <th className="border border-gray-700 px-4 py-2">Name</th>
                <th className="border border-gray-700 px-4 py-2">Price</th>
                <th className="border border-gray-700 px-4 py-2">Stock</th>
                <th className="border border-gray-700 px-4 py-2">Category</th>
                <th className="border border-gray-700 px-4 py-2">Sub-Category</th>
                <th className="border border-gray-700 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-800 transition duration-150 ease-in-out"
                >
                  <td className="border border-gray-700 px-4 py-2">
                    {product.images1 && product.images1.length > 0 ? (
                      <Image
                        src={`data:image/png;base64,${product.images1[0]}`}
                        alt={`Thumbnail of ${product.name}`}
                        width={64}
                        height={64}
                        className="object-cover rounded"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">{product.sku}</td>
                  <td className="border border-gray-700 px-4 py-2">{product.name}</td>
                  <td className="border border-gray-700 px-4 py-2">
                    {product.price ? `$${product.price.toFixed(2)}` : "N/A"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">{product.stock}</td>
                  <td className="border border-gray-700 px-4 py-2">
                    {resolveCategoryName(product.category)}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {resolveSubCategoryName(product.sub_category)}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editingProduct && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded"
                placeholder="Product Name"
              />
              <input
                type="text"
                value={editingProduct.sku}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, sku: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded"
                placeholder="SKU"
              />
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded"
                placeholder="Price"
              />
              <input
                type="number"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded"
                placeholder="Stock"
              />
              <select
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, category: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={editingProduct.sub_category}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, sub_category: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded"
              >
                <option value="">Select Sub-Category</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-between">
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 px-4 py-2 rounded text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="bg-red-500 px-4 py-2 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
