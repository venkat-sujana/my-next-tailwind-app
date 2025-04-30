'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const initialFormData = {
  lecturerName: '',
  fatherName: '',
  qualification: '',
  subject: '',
  email: '',
  phone: '',
  dateOfJoining: '', 
  address: '',
  gender: '',
  caste: ''   
};

export default function EditLecturerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLecturer = async () => {
      try {
        const res = await fetch(`https://my-next-tailwind-app-inky.vercel.app/api/lecturers/${id}`);
        const data = await res.json();
        setFormData({
          ...initialFormData,
          ...data,
        });
      } catch (error) {
        console.error('Error fetching lecturer:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLecturer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://my-next-tailwind-app-inky.vercel.app/api/lecturers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push('/lecturer-table');
      } else {
        alert('Failed to update lecturer!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred while updating');
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading lecturer data...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Lecturer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          'lecturerName',
          'fatherName', 
          'qualification', 
          'subject', 
          'email', 
          'phone', 
          'dateOfJoining',
          'address', 
          'gender',
          'caste',
        ].map((field) => (
          <div key={field}>
            <label className="block capitalize">{field}</label>
            {field === 'gender' || field === 'caste' ? (
              <select
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                {field === 'gender' ? (
                  <>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="">Select Caste</option>
                    <option value="OC">OC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="BC">BC</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'number' : 'text'}
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            )}
          </div>
        ))}
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Lecturer
        </button>
      </form>
    </div>
  );
}
