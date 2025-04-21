"use client";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Search,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);
      // alert("Students fetched successfully!");
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.branch}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // ✅ Export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students.xlsx");
  };

  // ✅ Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Student List", 14, 15);
    const tableColumn = [
      "S.No",
      "Name",
      "Email",
      "Age",
      "Branch",
      "Roll Number",
      "Admission Year",
    ];
    const tableRows = filteredStudents.map((student, index) => [
      index + 1,
      student.name,
      student.email,
      student.age,
      student.branch,
      student.rollNumber,
      student.admissionYear,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("students.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>

      {/* 🔍 Search Input with Icon */}
      <div className="relative mb-4 md:w-1/2 w-full">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, email, or branch..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 📤 Export Buttons with Icons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <FileText size={18} />
          Export PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <FileSpreadsheet size={18} />
          Export Excel
        </button>&nbsp;
        <button  className="bg-blue-500 text-white px-4 py-2 rounded"><Link href="https://my-next-tailwind-app-inky.vercel.app/" >Go back </Link></button>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">S. No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Branch</th>
              <th className="px-4 py-2 text-left">Roll Number</th>
              <th className="px-4 py-2 text-left">Admission Year</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student, index) => (
              <tr key={student._id} className="border-t">
                <td className="px-4 py-2">
                  {(currentPage - 1) * studentsPerPage + index + 1}
                </td>
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.email}</td>
                <td className="px-4 py-2">{student.age}</td>
                <td className="px-4 py-2">{student.branch}</td>
                <td className="px-4 py-2">{student.rollNumber}</td>
                <td className="px-4 py-2">{student.admissionYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No students found.</p>
        )}
      </div>

      {/* ⏪ Pagination with Icons */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-2 rounded border bg-gray-200"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded border ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-2 rounded border bg-gray-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
