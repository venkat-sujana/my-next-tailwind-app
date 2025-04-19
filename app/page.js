export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-lime-600 mb-8">
        Next.js 14 + Tailwind CSS
      </h1>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <p className="text-gray-700">
          ఈ ప్రాజెక్ట్‌లో Next.js 14 మరియు Tailwind CSSని ఉపయోగించాను!
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          క్లిక్ చేయండి
        </button>
      </div>
    </main>
  );
}
