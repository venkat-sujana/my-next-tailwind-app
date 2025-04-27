'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, User } from 'lucide-react';

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.gender || !formData.caste) {
      alert('Gender and Caste are required fields');
      return;
    }
    
    const res = await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      router.push('/student-table');
    } else {
      alert('Failed to add student');
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
          </button>
          {/* ... other buttons ... */}
        </div>
        {/* ... terms checkbox ... */}
      </form>
    </div>
  );
}