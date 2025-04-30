'use client'

import Link from 'next/link'

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center space-y-6 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-gray-800">Welcome</h1>
        <p className="text-gray-600 text-lg">Select a dashboard to continue</p>

        <div className="space-y-4">
          <Link href="/lecturer-dashboard">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow transition duration-300 cursor-pointer">
              🎓 Lecturer Dashboard
            </button>
          </Link>

          <Link href="/student-dashboard">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow transition duration-300 cursor-pointer">
              🎒 Student Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

