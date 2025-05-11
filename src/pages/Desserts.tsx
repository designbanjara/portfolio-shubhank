
import React from 'react';
import Sidebar from '../components/Sidebar';

const Desserts = () => {
  return (
    <div className="min-h-screen flex bg-portfolio-dark text-white">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-56">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-custom font-bold mb-6">Desserts</h1>
          <div className="space-y-6">
            <p className="text-lg">Explore Shubhank's favorite desserts and recipes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">Chocolate Lava Cake</h2>
                <p className="text-gray-300 mb-4">A decadent dessert with a molten chocolate center.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">Vanilla Bean Panna Cotta</h2>
                <p className="text-gray-300 mb-4">Silky smooth Italian dessert with fresh berries.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">Salted Caramel Brownies</h2>
                <p className="text-gray-300 mb-4">Fudgy brownies with a salted caramel swirl.</p>
              </div>
              <div className="border border-[#333] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">New York Cheesecake</h2>
                <p className="text-gray-300 mb-4">Classic creamy cheesecake with graham cracker crust.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desserts;
