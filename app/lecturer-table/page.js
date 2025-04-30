'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ReactPaginate from 'react-paginate';
import { Users, FileDown, FileSpreadsheet, Plus, Pencil, Trash2, Search, Printer } from 'lucide-react';

export default function LecturersPage() {
  const [lecturers, setLecturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [genderFilter, setGenderFilter] = useState('');
  const [casteFilter, setCasteFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);            // Loading state for fetch
  const lecturersPerPage = 5;
  const router = useRouter();
  const tableRef = useRef(null);                            // Table reference for printing
  
  const fetchLecturers = async () => {
    console.log('Fetching lecturers...');
    setLoading(true);                                        // API Call మొదలు అవగానే loading true స్పిన్నింగ్ అవుతుంది 
    try {
      const res = await fetch('https://my-next-tailwind-app-inky.vercel.app/api/lecturers'); // API URL
      const data = await res.json();
      console.log('Fetched lecturers:', data);
      setLecturers(data);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    } finally {
      setLoading(false);                                   // API Call పూర్తయిన తర్వాత loading false అవుతుంది అంటే టేబల్ ను చూపిస్తుంది 
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const handleDelete = async (id) => {
    console.log('Deleting lecturer with id:', id);
    if (confirm('Are you sure to delete?')) {
      try {
        const res = await fetch(`https://my-next-tailwind-app-inky.vercel.app/api/lecturers/${id}`, { method: 'DELETE' });
        console.log('Deleted lecturer:', res.ok);
        fetchLecturers();
      } catch (error) {
        console.error('Error deleting lecturer:', error);
      }
    }
  };

  const filteredLecturers = lecturers.filter((l) => {
    return (
      l.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (genderFilter === '' || l.gender === genderFilter) &&
      (casteFilter === '' || l.caste === casteFilter)
    );
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Lecturer List", 14, 15);
    const tableColumn = ["S.No", "Lecture Name", "Father Name", "Qualification", "Subject", "Email", "Phone", "Date of Joining", "Address", "Gender", "Caste"];
    const tableRows = filteredLecturers.map((lecturer, index) => [
      index + 1,
      lecturer.lecturerName,
      lecturer.fatherName,
      lecturer.qualification,
      lecturer.subject,
        lecturer.email,
        lecturer.phone,
        lecturer.dateOfJoining,
        lecturer.address,
        lecturer.gender,
        lecturer.caste
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("lecturers.pdf");
  };

  const handleExportExcel = () => {
    const exportData = filteredLecturers.map(l => ({
      LecturerName: l.lecturerName,
       FatherName: l.fatherName,
        Qualification: l.qualification,
         Subject: l.subject,
        Email: l.email,
        Phone: l.phone,
        DateOfJoining: l.dateOfJoining,
        Address: l.address,
        Gender: l.gender,
        Caste: l.caste,
      
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lecturers');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'lecturers.xlsx');
  };

  const handlePrintTable = () => {
    const printContent = tableRef.current;
    const WindowPrt = window.open('', '', 'width=900,height=650');
    WindowPrt.document.write(`
      <html>
        <head>
          <title>Lecturer List</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Lecturer List</h1>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  };
  const pageCount = Math.ceil(filteredLecturers.length / lecturersPerPage);
  const offset = currentPage * lecturersPerPage;
  const currentLecturers = filteredLecturers.slice(offset, offset + lecturersPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

   const genders = [...new Set(lecturers.map((l) => l.gender))];
  const castes = [...new Set(lecturers.map((l) => l.caste))];

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {loading ? (
        <div className="flex justify-center items-center h-64">
         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
         <p className="text-blue-600 text-lg font-semibold">Loading Lecturers...</p>
        </div>
      ) : (
        
     


    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center"><Users size='20' color='green'/>&nbsp;All Lecturers</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/add-lecturer')} className="bg-green-600 text-white px-4 py-2 rounded flex items-center cursor-pointer"><Plus size={20} />&nbsp;Add Lecturer</button>
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
        
        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="border px-4 py-2 rounded">
          <option value=''>All Genders</option>
          {genders.filter(g => g).map(gender => <option key={gender} value={gender}>{gender}</option>)}
        </select>

        <select value={casteFilter} onChange={(e) => setCasteFilter(e.target.value)} className="border px-4 py-2 rounded">
          <option value=''>All Castes</option>
          {castes.filter(c => c).map(caste => <option key={caste} value={caste}>{caste}</option>)}
        </select>
      </div>

      {/* Table */}
      <table ref={tableRef} className="min-w-full mt-4 bg-white shadow rounded-lg">
        <thead className="bg-gray-200 border-t">
          <tr>
            <th className="px-4 py-2 text-left">S.No</th>
            <th className="px-4 py-2 text-left">Lecturer Name</th>
            <th className="px-4 py-2 text-left">Fathers Name</th>
            <th className="px-4 py-2 text-left">Qualification</th>
            <th className="px-4 py-2 text-left">Subject</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Date of Joining</th>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">Gender</th>
            <th className="px-4 py-2 text-left">Caste</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLecturers.map((lecturer, index) => (
            <tr key={lecturer._id} className="border-t text-center">
              <td className="px-4 py-2">{offset + index + 1}</td>
              <td className="px-4 py-2">{lecturer.lecturerName}</td>
              <td className="px-4 py-2">{lecturer.fatherName}</td>
              <td className="px-4 py-2">{lecturer.qualification}</td>
              <td className="px-4 py-2">{lecturer.subject}</td>
              <td className="px-4 py-2">{lecturer.email}</td>
              <td className="px-4 py-2">{lecturer.phone}</td>
              <td className="px-4 py-2">{lecturer.dateOfJoining}</td>
              <td className="px-4 py-2">{lecturer.address}</td>
              <td className="px-4 py-2">{lecturer.gender}</td>
              <td className="px-4 py-2">{lecturer.caste}</td>
              <td className="space-x-2">
                <button onClick={() => router.push(`/edit-lecturer/${lecturer._id}`)} className="text-blue-600 cursor-pointer px-2 py-2"><Pencil size={20}/></button>
                <button onClick={() => handleDelete(lecturer._id)} className="text-red-600 cursor-pointer px-2"><Trash2 size={20}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredLecturers.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No Lecture found.</p>
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

      {/* Bottom Buttons */}
      <div className="flex items-center mb-4 mt-6 gap-4">
        <button onClick={handlePrintTable} className="bg-purple-600 text-white px-4 py-2 rounded flex items-center cursor-pointer">
          <Printer size={20} />&nbsp;Print Table
        </button>
        <button onClick={() => router.push('/add-lecturer')} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">Back</button>
        <button onClick={() => router.push('/')} className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Home</button>
      </div>
    </div>

      )}
    </div>

  );



  
}
