'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus,User} from 'lucide-react';

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    branch: '',
    rollNumber: '',
    admissionYear: ''
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(' https://my-next-tailwind-app-inky.vercel.app/api/students', {
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
      <h1 className="text-2xl font-bold mb-4 flex items-center"><User size={30} color='green'/>&nbsp;Add New Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email',  'age', 'branch', 'rollNumber', 'admissionYear'].map((field) => (
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
        <div className="flex items-center mb-4">
          
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center cursor-pointer"><Plus size={20} color='white'/>Add</button>&emsp;
         <button onClick={() => router.push('/student-table')} className="bg-red-500 text-white px-4 py-2 rounded flex items-center cursor-pointer">Cancel</button>&emsp;
        <button onClick={() => router.push('/')} className="bg-gray-500 text-white px-4 py-2 rounded flex items-center cursor-pointer">Home</button>
        </div>
        <div className="flex items-center mb-4">
          <input type="checkbox" id="terms" required className="mr-2" />
          <label htmlFor="terms">I agree to the terms and conditions</label>
          </div>
          
      </form>
    </div>
  );
}
