'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, User, Home, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddLecturerPage() {
  const [formData, setFormData] = useState({
    lecturerName: '',
    fatherName: '',                               
    qualification: '',                                  
    subject: '',                          
    email: '',
    phone: '',
    dateOfJoining: '', 
    address: '',
    gender: '',
    caste: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.phone || !formData.email) {
      toast.error('Phone and Email are required fields');
      setIsSubmitting(false);
      return;
    }

    // Phone number validation
    if (!/^\d+$/.test(formData.phone)) {
      toast.error('Phone number should contain only digits');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const res = await fetch('https://my-next-tailwind-app-inky.vercel.app/api/lecturers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success('Lecturer added successfully!');
        setTimeout(() => {
          router.push('/lecturer-table');
        }, 1000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add lecturer');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    { name: 'lecturerName', label: 'Lecturer Name', type: 'text', required: true },
    { name: 'fatherName', label: 'Father Name', type: 'text', required: true },
    { name: 'qualification', label: 'Qualification', type: 'text', required: true },
    { name: 'subject', label: 'Subject', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text', required: true, pattern: '[0-9]+' },
    { name: 'dateOfJoining', label: 'Date of Joining', type: 'date', required: true },
    { name: 'address', label: 'Address', type: 'text', required: true },
  ];

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const casteOptions = [
    { value: '', label: 'Select Caste' },
    { value: 'OC', label: 'OC' },
    { value: 'SC', label: 'SC' },
    { value: 'ST', label: 'ST' },
    { value: 'BC', label: 'BC' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
        <User size={30} className="text-green-600 mr-2"/> Add New Lecturer
      </h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {inputFields.map((field) => (
    <div key={field.name}>
      <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        required={field.required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        pattern={field.pattern}
        placeholder={`Enter ${field.label.toLowerCase()}`}
      />
    </div>
  ))}

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Gender <span className="text-red-500">*</span>
    </label>
    <select
      name="gender"
      value={formData.gender}
      onChange={handleChange}
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {genderOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Caste <span className="text-red-500">*</span>
    </label>
    <select
      name="caste"
      value={formData.caste}
      onChange={handleChange}
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {casteOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>

  <div className="md:col-span-2 flex items-center justify-end space-x-3 pt-4">
    <button
      type="button"
      onClick={() => router.push('/lecturer-table')}
      className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
    >
      <Home size={18} className="mr-1" /> Home
    </button>

    <button
      type="button"
      onClick={() => router.push('/lecturer-table')}
      className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
    >
      <X size={18} className="mr-1" /> Cancel
    </button>

    <button
      type="submit"
      disabled={isSubmitting}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
    >
      <Plus size={18} className="mr-1" />
      {isSubmitting ? 'Adding...' : 'Add Lecturer'}
    </button>
  </div>
</form>

    </div>
  );
}