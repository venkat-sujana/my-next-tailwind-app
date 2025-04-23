'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable"; // ✅ Correct way
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ReactPaginate from 'react-paginate';



export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const studentsPerPage = 5;
  const router = useRouter();

  const fetchStudents = async () => {
    const res = await fetch('https://my-next-tailwind-app-inky.vercel.app/api/students');
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure to delete?')) {
      await fetch(`https://my-next-tailwind-app-inky.vercel.app/api/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    }
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
  
    // ✅ use autoTable from the plugin
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
    doc.save("students.pdf");
  };
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStudents);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'students.xlsx');
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredStudents.length / studentsPerPage);
  const offset = currentPage * studentsPerPage;
  const currentStudents = filteredStudents.slice(offset, offset + studentsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Students</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/add-student')} className="bg-green-600 text-white px-4 py-2 rounded">+ Add Student</button>
          <button onClick={handleExportPDF} className="bg-blue-500 text-white px-4 py-2 rounded">Export PDF</button>
          <button onClick={handleExportExcel} className="bg-yellow-500 text-white px-4 py-2 rounded">Export Excel</button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 mb-4 w-full rounded"
      />

      <table className="min-w-full bg-white shadow rounded-lg ">
        <thead className="bg-gray-200 border-t">
          <tr className="bg-gray-200 border-t" >
            <th className="px-4 py-2 text-left">S.No</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Age</th>
            <th className="px-4 py-2 text-left">Branch</th>
            <th className="px-4 py-2 text-left">Roll</th>
            <th className="px-4 py-2 text-left">Year</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student, index) => (
            <tr key={student._id} className="border-t text-center">
              <td className="px-4 py-2">{offset + index + 1}</td>
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2">{student.age}</td>
              <td className="px-4 py-2">{student.branch}</td>
              <td className="px-4 py-2">{student.rollNumber}</td>
              <td className="px-4 py-2">{student.admissionYear}</td>
              <td className="space-x-2">
                <button onClick={() => router.push(`/edit-student/${student._id}`)} className="text-blue-600 ">Edit</button>
                <button onClick={() => handleDelete(student._id)} className="text-red-600 ">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredStudents.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No students found.</p>
        )}


      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <ReactPaginate
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName="flex space-x-2"
          activeClassName="font-bold text-blue-600"
          previousLabel=""
          nextLabel=""
          breakLabel="..."
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageClassName="px-3 py-1 border rounded"
        />
      </div>
    </div>
  );
}
