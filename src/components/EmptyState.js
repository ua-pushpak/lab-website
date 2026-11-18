import React from 'react';

const EmptyState = ({ icon = 'fa-inbox', title = 'No Data Found', description = 'There is nothing to display here yet.' }) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-drone-gray rounded-full flex items-center justify-center mx-auto mb-4">
        <i className={`fas ${icon} text-drone-blue text-3xl`}></i>
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default EmptyState;