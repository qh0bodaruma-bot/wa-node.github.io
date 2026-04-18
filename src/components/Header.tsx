import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <a href="#">
            {/* テキストロゴ（画像がある場合はimgタグに差し替え可能） */}
            <span className="logo-text">和-Node</span>
          </a>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li><a href="#concept" className="nav-link">Concept</a></li>
            <li><a href="#services" className="nav-link">Services</a></li>
            <li><a href="mailto:contacts@wa-node.com" className="nav-link btn-header">お問い合わせ</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
