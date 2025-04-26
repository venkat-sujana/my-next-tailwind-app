'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ReactPaginate from 'react-paginate';
import { Users, FileDown, FileSpreadsheet, Plus, Pencil, Trash2, Search } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [casteFilter, setCasteFilter] = useState('');
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

  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (branchFilter === '' || s.branch === branchFilter) &&
      (genderFilter === '' || s.gender === genderFilter) &&
      (casteFilter === '' || s.caste === casteFilter)
    );
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Student List", 14, 15);
    const tableColumn = ["S.No", "Name", "Email", "Age", "Gender", "Caste", "Branch", "Roll Number", "Admission Year"];
    const tableRows = filteredStudents.map((student, index) => [
      index + 1,
      student.name,
      student.email,
      student.age,
      student.gender,
      student.caste,
      student.branch,
      student.rollNumber,
      student.admissionYear,
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("students.pdf");
  };

  const handleExportExcel = () => {
    const exportData = filteredStudents.map(s => ({
      Name: s.name,
      Email: s.email,
      Age: s.age,
      Gender: s.gender,
      Caste: s.caste,
      Branch: s.branch,
      RollNumber: s.rollNumber,
      AdmissionYear: s.admissionYear,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'students.xlsx');
  };

  const pageCount = Math.ceil(filteredStudents.length / studentsPerPage);
  const offset = currentPage * studentsPerPage;
  const currentStudents = filteredStudents.slice(offset, offset + studentsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const branches = [...new Set(students.map((s) => s.branch))];
  const genders = [...new Set(students.map((s) => s.gender))];
  const castes = [...new Set(students.map((s) => s.caste))];

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center"><Users size='20' color='green'/>&nbsp;All Students</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/add-student')} className="bg-green-600 text-white px-4 py-2 rounded flex items-center cursor-pointer"><Plus size={20} />&nbsp;Add Student</button>
          <button onClick={handleExportPDF} className="bg-blue-500 text-white px-4 py-2 flex items-center rounded cursor-pointer"><FileDown size={20} />&nbsp;Export PDF</button>
          <button onClick={handleExportExcel} className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center cursor-pointer"><FileSpreadsheet size={20} />&nbsp;Export Excel</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative w-full">
          <input 
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full"
          />
          <Search className="absolute left-2 top-2.5 text-gray-500" size={20} />
        </div>
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="border px-4 py-2 rounded">
          <option value=''>All Branches</option>
          {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
        </select>
        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="border px-4 py-2 rounded">
          <option value=''>All Genders</option>
          {genders.filter(g => g).map(gender => <option key={gender} value={gender}>{gender}</option>)}
        </select>
        <select value={casteFilter} onChange={(e) => setCasteFilter(e.target.value)} className="border px-4 py-2 rounded">
          <option value=''>All Castes</option>
          {castes.filter(c => c).map(caste => <option key={caste} value={caste}>{caste}</option>)}
        </select>
      </div>

      <table className="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead className="bg-gray-200 border-t">
          <tr>
            <th className="px-4 py-2 text-left">S.No</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Age</th>
            <th className="px-4 py-2 text-left">Gender</th>
            <th className="px-4 py-2 text-left">Caste</th>
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
              <td className="px-4 py-2">{student.gender}</td>
              <td className="px-4 py-2">{student.caste}</td>
              <td className="px-4 py-2">{student.branch}</td>
              <td className="px-4 py-2">{student.rollNumber}</td>
              <td className="px-4 py-2">{student.admissionYear}</td>
              <td className="space-x-2">
                <button onClick={() => router.push(`/edit-student/${student._id}`)} className="text-blue-600 cursor-pointer px-2 py-2"><Pencil size={20}/></button>
                <button onClick={() => handleDelete(student._id)} className="text-red-600 cursor-pointer px-2"><Trash2 size={20}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredStudents.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No students found.</p>
      )}

      <div className="mt-4 flex justify-center">
        <ReactPaginate
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName="flex space-x-2"
          activeClassName="font-bold text-blue-600 cursor-pointer"
          pageClassName="cursor-pointer px-3 py-1 border rounded"
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
        />
      </div>

      <div className="flex items-center mb-4 mt-6 gap-4">
        <button onClick={() => router.push('/add-student')} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">Back</button>
        <button onClick={() => router.push('/')} className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Home</button>
      </div>
    </div>
  );
}
