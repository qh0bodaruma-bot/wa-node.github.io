import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-info">
          <h2 className="footer-logo">和-Node</h2>
          <p className="footer-desc">
            ITコンサル・企業コンサル・心理カウンセリング<br />
            心とITの両方がわかるパートナー<br />
            <br />
            お問い合わせ: <a href="mailto:contacts@wa-node.com" style={{ textDecoration: 'underline' }}>contacts@wa-node.com</a>
          </p>
        </div>
        <div className="footer-links">
          <ul>
            <li><a href="#concept">Concept</a></li>
            <li><a href="#services">Services</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} 和-Node. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
