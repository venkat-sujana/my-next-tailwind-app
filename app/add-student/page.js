//app/api/add-student/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',                               
    age: '',                                  
    branch: '',                          
    rollNumber: '',
    admissionYear: '',
    gender: '', // New field
    caste: ''   // New field
  });

  const router = useRouter();

  const handleChange = (e) => {
    console.log('Field name:', e.target.name);
    console.log('Field value:', e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log('Updated formData:', formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    if (!formData.gender || !formData.caste) {
      console.log('Gender and Caste are required fields');
      alert('Gender and Caste are required fields');
      return;
    }
    
    const res = await fetch('https://my-next-tailwind-app-inky.vercel.app/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    console.log('Response:', res);
    if (res.ok) {
      toast.success('Student added successfully!');
      setTimeout(() => {   // 1 sec తర్వాత navigate అవుతుంది
        router.push('/student-table');
      }, 1000);
    } else {
      const errorData = await res.json();
      toast.error(errorData.message || 'Failed to add student!');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <User size={30} color='green'/>&nbsp;Add New Student
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Existing fields */}
        {['name', 'email', 'age', 'branch', 'rollNumber', 'admissionYear'].map((field) => (
          <div key={field}>
            <label className="block capitalize">{field}</label>
            <input
              type={field === 'age' || field === 'admissionYear' ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
        ))}

        {/* New Gender Field */}
        <div>
          <label className="block">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* New Caste Field */}
        <div>
          <label className="block">Caste</label>
          <select
            name="caste"
            value={formData.caste}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Caste</option>
            <option value="OC">OC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="BC">BC</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center mb-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center cursor-pointer">
            <Plus size={20} color='white'/> Add
          </button>&nbsp;
          <button onClick={() => router.push('/student-table')} className="bg-red-500 text-white px-4 py-2 rounded flex items-center cursor-pointer">Cancel</button>&emsp;

        <button onClick={() => router.push('/')} className="bg-gray-500 text-white px-4 py-2 rounded flex items-center cursor-pointer">Home</button>

          {/* ... other buttons ... */}
        </div>
        {/* ... terms checkbox ... */}
      </form>
    </div>
  );
}
