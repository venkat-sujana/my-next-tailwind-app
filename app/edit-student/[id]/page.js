'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Initial form data with all required fields
const initialFormData = {
  name: '',
  email: '',
  age: '',
  branch: '',
  rollNumber: '',
  admissionYear: '',
  gender: 'Other', // Default value
  caste: 'Other'   // Default value
};

export default function EditStudentPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/students/${id}`);
        const data = await res.json();
        
        // Merge fetched data with initial form data to ensure all fields exist
        setFormData({
          ...initialFormData,
          ...data,
          age: data.age || '',
          admissionYear: data.admissionYear || ''
        });
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudent();
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
      const res = await fetch(`http://localhost:3000/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push('/student-table');
      } else {
        alert('Failed to update student');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred while updating');
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading student data...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          'name', 
          'email', 
          'age', 
          'branch', 
          'rollNumber', 
          'admissionYear',
          'gender',
          'caste'
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
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
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
                type={field === 'age' || field === 'admissionYear' ? 'number' : 'text'}
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
          Update Student
        </button>
      </form>
    </div>
  );
}