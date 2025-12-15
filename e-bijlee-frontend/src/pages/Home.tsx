export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex flex-col items-center justify-center">
      
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-blue-700 drop-shadow-lg flex items-center justify-center gap-3">
          <span className="glow">⚡</span> E-Bijilee
        </h1>
        <p className="mt-3 text-xl text-gray-700 font-semibold">
          Smart Utility Billing System
        </p>

        <div className="mt-8 flex gap-6 justify-center">
          <a
            href="/register"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 shadow-md transition duration-200"
          >
            Register
          </a>

          <a
            href="/login"
            className="px-8 py-3 bg-orange-500 text-white rounded-lg text-lg font-medium hover:bg-orange-600 shadow-md transition duration-200"
          >
            Login
          </a>
        </div>
      </div>

    </div>
  );
}
