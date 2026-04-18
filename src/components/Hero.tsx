import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      {/* 背景の円相アニメーション用要素 */}
      <div className="hero-bg-enso"></div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">気持ちに寄り添いながら、</span>
            <span className="title-line">根本から解決まで。</span>
          </h1>
          <p className="hero-subtitle">
            分析と共感、両方できる心理カウンセラーです
          </p>
          <div className="hero-action">
            <a href="#services" className="btn btn-primary">サービスを見る</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
