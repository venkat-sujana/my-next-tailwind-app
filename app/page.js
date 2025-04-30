'use client'

import Link from 'next/link'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-4'>
      <h1 className='text-3xl font-bold'>Home Page</h1>

      <Link href="/lecturer-dashboard">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer">
          Lecturer Dashboard
        </button>
      </Link>

      <Link href="/student-dashboard">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer">
          Student Dashboard
        </button>
      </Link>
    </div>
  )
}

export default Home
