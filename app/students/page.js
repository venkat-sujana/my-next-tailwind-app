"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // 🟢 Correct way
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  // 🟥 Export to PDF Function
  const exportToPDF = () => {
    const doc = new jsPDF();
  
    const tableColumn = [
      "S. No",
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
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
    doc.save("student_list.pdf");
  };
  
  // 🟩 Export to Excel Function
  const exportToExcel = () => {
    const worksheetData = filteredStudents.map((student, index) => ({
      "S. No": index + 1,
      Name: student.name,
      Email: student.email,
      Age: student.age,
      Branch: student.branch,
      "Roll Number": student.rollNumber,
      "Admission Year": student.admissionYear,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "student_list.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name, email, or branch..."
        className="mb-4 p-2 border border-gray-300 rounded w-full md:w-1/2"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* 📤 Export Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={exportToPDF}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Export to PDF
        </button>
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
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

      {/* ⏪ Pagination Controls with Page Numbers */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
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
        </div>
      )}
    </div>
  );
}
