"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If no user is logged in, redirect to sign-in page
        router.push("/");
      } else {
        setLoading(false);
        // You can also check for admin role here if needed
        // if (user.email !== "admin@example.com") {
        //   router.push("/not-authorized");
        // }
      }
    });

    // Clean up subscription when the component is unmounted
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {/* Your dashboard content */}
    </div>
  );
}
