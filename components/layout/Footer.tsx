
import React from 'react';
import { SITE_NAME } from '../../constants';

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-slate-900/50 border-t border-cyan-500/20 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All Rights Reserved.</p>
        </div>
      </footer>
      {/* Modal container can be placed here if a portal is not used */}
    </>
  );
};

export default Footer;
