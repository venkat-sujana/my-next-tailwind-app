// Dashboard.js
'use client';
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { User,Users} from 'lucide-react';

import { useRouter } from 'next/navigation';
//https://my-next-tailwind-app-inky.vercel.app/





export default function Dashboardlecturer() {

  const router = useRouter(); // ✅ Initialize the router

  const [lecturers, setLecturers] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const subjects = [...new Set(lecturers.map(s => s.subject))];
  const subjectCount = subjects.map(subject => ({
    name: subject,
    value: lecturers.filter(s => s.subject === subject).length
  }));
 

  const fetchLecturers = async () => {
    const res = await fetch('https://my-next-tailwind-app-inky.vercel.app/api/lecturers');
    const data = await res.json();
    setLecturers(data);
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const totalLecturers = lecturers.length;
  const names = [...new Set(lecturers.map(s => s.lecturerName))];
  const nameCount = names.map(lecturerName => ({
    name: lecturerName,
    value: lecturers.filter(s => s.lecturerName === lecturerName).length,
  }));

 




  
  return (
<div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">lecturers Dashboard</h1>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Student */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Add New Lecturer</h2>
          <p className="text-gray-600 mb-4">Register a new lecturer into the system.</p>
          <button
            onClick={() => router.push('/add-lecturer')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Go to Form
          </button>
        </div>

        {/* View All Students */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">All Lecturer</h2>
          <p className="text-gray-600 mb-4">View, edit, or delete lecturer records.</p>
          <button
            onClick={() => router.push('/lecturer-table')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            View Table
          </button>
        </div>
      </div>


{/* Tiles */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold flex items-center"><Users size={30} color='white'/>Total Lecturers</h2>
          <p className="text-3xl mt-2">{totalLecturers}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold">Lecturer name</h2>
          <p className="text-3xl mt-2">{lecturers.length}</p>
        </div>
        
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
       
        {/* Table instead of Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
  <h3 className="text-xl font-semibold mb-4">Lecturer by Name</h3>
  <table className="min-w-full bg-white border rounded-lg overflow-hidden">
    <thead>
      <tr className="bg-gray-200 text-gray-700">
        <th className="px-4 py-2 text-left border">S.No</th>
        <th className="px-4 py-2 text-left border">Lecturer Name</th>
        <th className="px-4 py-2 text-left border">Subject</th>
        <th className="px-4 py-2 text-left border">Count</th>
      </tr>
    </thead>
    <tbody>
      {nameCount.map((item, index) => (
        <tr
          key={index}
          className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}
        >
          <td className="px-4 py-2 border text-gray-700">{index + 1}</td>
          <td className="px-4 py-2 border font-semibold text-gray-800">{item.name}</td>
          <td className="px-4 py-2 border font-semibold text-gray-800">{item.subject}</td>
          <td className="px-4 py-2 border text-gray-800 font-semibold">{item.value}</td>
        </tr>
      ))}

      {/* Total Row */}
      <tr className="bg-green-100 border-t-2 border-green-400">
        <td className="px-4 py-2 font-bold text-green-800 border" colSpan={3}>Total</td>
        <td className="px-4 py-2 font-bold text-green-800 border">
          {nameCount.reduce((total, item) => total + item.value, 0)}
        </td>
      </tr>
    </tbody>
  </table>
</div>


      </div>
 </div>
 );





 






}
