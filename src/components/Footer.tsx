import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 py-6 mt-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">Mobile Legends Tournament Bracket</h3>
          <p className="text-gray-400 text-sm mb-4">29 Mei 2025</p>
          <p className="text-gray-500 text-xs">
            © 29 Tournament Organizer. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 