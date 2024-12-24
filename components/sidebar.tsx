"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // For redirecting to login page after sign-out
import { auth } from '../app/lib/firebase-config'
import { FiHome, FiBox, FiList, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      alert('You have been logged out!');
      router.push('/'); // Redirect to login page (or wherever you want to redirect the user)
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };
  return (
    <div className={`flex flex-col bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-20'} h-screen transition-all`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 text-gray-400 focus:outline-none hover:text-white"
      >
        <FiMenu size={24} />
      </button>

      {/* Navigation Links */}
      <nav className="flex-grow">
        <ul>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <FiHome size={20} className="mr-2" />
            {isOpen && 'Dashboard'}
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center cursor-pointer">
  <Link href="/dashboard/products" className="flex items-center w-full">
    <FiBox size={20} className="mr-2" />
    {isOpen && 'Products'}
  </Link>
</li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
  <Link href="/dashboard/orders" className="flex items-center w-full">

            <FiList size={20} className="mr-2" />
            {isOpen && 'Orders'}
  </Link>

          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
  <Link href="/dashboard/categories" className="flex items-center w-full">

            <FiList size={20} className="mr-2" />
            {isOpen && 'Categories'}
  </Link>

          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center">
            <FiSettings size={20} className="mr-2" />
            {isOpen && 'Settings'}
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <button 
      onClick={handleLogout}
      className="p-4 hover:bg-gray-700 flex items-center"
    >
      <FiLogOut size={20} className="mr-2" />
      {isOpen && 'Logout'}
    </button>
    </div>
  );
};

export default Sidebar;