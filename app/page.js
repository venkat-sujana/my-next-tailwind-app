"use client";
import { useState } from "react";

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
      body: JSON.stringify(form),
    });
    alert("Student added!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white shadow rounded">
      <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full" />
      <input name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" />
      <input name="age" placeholder="Age" onChange={handleChange} className="border p-2 w-full" />
      <input name="branch" placeholder="Branch" onChange={handleChange} className="border p-2 w-full" />
      <input name="rollNumber" placeholder="Roll Number" onChange={handleChange} className="border p-2 w-full" />
      <input name="admissionYear" placeholder="Admission Year" onChange={handleChange} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Student</button>
    </form>
  );
}

