"use client";
import { useState } from "react";
import Link from "next/link";

export default function AddStudent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    branch: "",
    rollNumber: "",
    admissionYear: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Student added!");
    
    // 👉 Clear form after submission
    setForm({
      name: "",
      email: "",
      age: "",
      branch: "",
      rollNumber: "",
      admissionYear: "",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Add New Student</h1>
      <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white shadow rounded">
        <input name="name" value={form.name} placeholder="Student Name" onChange={handleChange} className="border p-2 w-full" />
        <input name="email" value={form.email} placeholder="Email" onChange={handleChange} className="border p-2 w-full" />
        <input name="age" value={form.age} placeholder="Age" onChange={handleChange} className="border p-2 w-full" />
        <input name="branch" value={form.branch} placeholder="Branch" onChange={handleChange} className="border p-2 w-full" />
        <input name="rollNumber" value={form.rollNumber} placeholder="Roll Number" onChange={handleChange} className="border p-2 w-full" />
        <input name="admissionYear" value={form.admissionYear} placeholder="Admission Year" onChange={handleChange} className="border p-2 w-full" />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Student</button>
          <Link href="http://localhost:3000/students">
            <button type="button" className="bg-green-500 text-white px-4 py-2 rounded">View</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
