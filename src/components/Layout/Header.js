import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full bg-gwentAccent py-2 shadow-lg fixed top-0 z-20">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold">Proteus Nebule</Link>
        <nav>
          <Link to="/" className="mx-2 hover:underline">Login</Link>
          <Link to="/register" className="mx-2 hover:underline">Register</Link>
          <Link to="/game" className="mx-2 hover:underline">Game</Link>
          <Link to="/dos" className="mx-2 hover:underline">DOS</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;