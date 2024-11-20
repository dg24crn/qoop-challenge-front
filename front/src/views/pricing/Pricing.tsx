const Pricing = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Pick your Plan
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-80 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">FREE</h2>
          <p className="text-gray-600 text-center mb-6">
            Perfect for getting started with basic features.
          </p>
          <ul className="mb-6 space-y-2 text-sm text-gray-700">
            <li>✔️ View projects and tasks</li>
            <li>❌ Cannot create or manage projects</li>
            <li>❌ No external API access</li>
          </ul>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-not-allowed"
            disabled
          >
            Current Plan
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 w-80 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">PREMIUM</h2>
          <p className="text-gray-600 text-center mb-6">
            Unlock full access to all platform features.
          </p>
          <ul className="mb-6 space-y-2 text-sm text-gray-700">
            <li>✔️ Create and manage projects</li>
            <li>✔️ Assign tasks to team members</li>
            <li>✔️ Access external API</li>
          </ul>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
