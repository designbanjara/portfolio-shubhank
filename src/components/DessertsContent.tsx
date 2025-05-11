
import React from 'react';

const DessertsContent = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-custom font-bold mb-6">Desserts</h1>
      <div className="space-y-6">
        <p className="text-lg">Explore Shubhank's favorite desserts and recipes.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="border border-[#333] rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Chocolate Lava Cake</h2>
            <p className="text-gray-300 mb-4">A decadent dessert with a molten chocolate center.</p>
            <a href="#" className="text-[#F97316] hover:underline">View Recipe</a>
          </div>
          <div className="border border-[#333] rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Vanilla Bean Panna Cotta</h2>
            <p className="text-gray-300 mb-4">Silky smooth Italian dessert with fresh berries.</p>
            <a href="#" className="text-[#F97316] hover:underline">View Recipe</a>
          </div>
          <div className="border border-[#333] rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Salted Caramel Brownies</h2>
            <p className="text-gray-300 mb-4">Fudgy brownies with a salted caramel swirl.</p>
            <a href="#" className="text-[#F97316] hover:underline">View Recipe</a>
          </div>
          <div className="border border-[#333] rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">New York Cheesecake</h2>
            <p className="text-gray-300 mb-4">Classic creamy cheesecake with graham cracker crust.</p>
            <a href="#" className="text-[#F97316] hover:underline">View Recipe</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DessertsContent;
