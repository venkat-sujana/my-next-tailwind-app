// Dashboard.js
'use client';
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { User,Users} from 'lucide-react';

import { useRouter } from 'next/navigation';
//https://my-next-tailwind-app-inky.vercel.app/





export default function Dashboardstudent() {

  const router = useRouter(); // ✅ Initialize the router

  const [students, setStudents] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

 

  const fetchStudents = async () => {
    const res = await fetch('https://my-next-tailwind-app-inky.vercel.app/api/students');
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const totalStudents = students.length;
  const branches = [...new Set(students.map(s => s.branch))];
  const branchCount = branches.map(branch => ({
    name: branch,
    value: students.filter(s => s.branch === branch).length,
  }));

  const yearCount = [...new Set(students.map(s => s.admissionYear))].map(year => ({
    year: year,
    count: students.filter(s => s.admissionYear === year).length,
  }));



  


  return (
<div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Student Dashboard</h1>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Student */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Add New Student</h2>
          <p className="text-gray-600 mb-4">Register a new student into the system.</p>
          <button
            onClick={() => router.push('/add-student')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Go to Form
          </button>
        </div>

        {/* View All Students */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">All Students</h2>
          <p className="text-gray-600 mb-4">View, edit, or delete student records.</p>
          <button
            onClick={() => router.push('/student-table')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            View Table
          </button>
        </div>
      </div>


{/* Tiles */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold flex items-center"><Users size={30} color='white'/>Total Students</h2>
          <p className="text-3xl mt-2">{totalStudents}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold">Branches</h2>
          <p className="text-3xl mt-2">{branches.length}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold">Years</h2>
          <p className="text-3xl mt-2">{[...new Set(students.map(s => s.admissionYear))].length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
       
        {/* Table instead of Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
  <h3 className="text-xl font-semibold mb-4">Students by Branch</h3>
  <table className="min-w-full bg-white border rounded-lg overflow-hidden">
    <thead>
      <tr className="bg-gray-200 text-gray-700">
        <th className="px-4 py-2 text-left border">S.No</th>
        <th className="px-4 py-2 text-left border">Branch</th>
        <th className="px-4 py-2 text-left border">Count</th>
      </tr>
    </thead>
    <tbody>
      {branchCount.map((item, index) => (
        <tr
          key={index}
          className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}
        >
          <td className="px-4 py-2 border text-gray-700">{index + 1}</td>
          <td className="px-4 py-2 border font-semibold text-gray-800">{item.name}</td>
          <td className="px-4 py-2 border text-gray-800 font-semibold">{item.value}</td>
        </tr>
      ))}

      {/* Total Row */}
      <tr className="bg-green-100 border-t-2 border-green-400">
        <td className="px-4 py-2 font-bold text-green-800 border" colSpan={2}>Total</td>
        <td className="px-4 py-2 font-bold text-green-800 border">
          {branchCount.reduce((total, item) => total + item.value, 0)}
        </td>
      </tr>
    </tbody>
  </table>
</div>

{/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Students by Admission Year</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearCount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
 </div>
 );





 






}
