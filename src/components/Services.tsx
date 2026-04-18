import React from 'react';
import './Services.css';

const Services: React.FC = () => {
  return (
    <section id="services" className="section services">
      <div className="container">
        <h2 className="section-title">Services</h2>
        <div className="services-grid">
          
          {/* 心理カウンセラー */}
          <div className="service-card accent-card">
            <div className="service-icon">心</div>
            <h3 className="service-title">心理カウンセリング</h3>
            <div className="service-desc">
              <p>言葉にならなくても、上手くまとまらなくても大丈夫です。<br/>
              あなたが今抱えている痛みや孤独に、まずはそのままの形でそっと寄り添います。</p>
              <p style={{ marginTop: '10px' }}>どんな些細なことでも、まとまっていない悩みでも、どうかひとりで抱え込まずにご連絡ください。一緒に少しずつ紐解きながら、あなたが再び晴れやかな一歩を踏み出せるよう、心からサポートいたします。</p>
            </div>
            <a 
              href="https://docs.google.com/forms/d/1HPqd0Y25st3gqtj08oLHHymD0BRXSpWhUyZ76e9aqgY/edit" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-accent"
            >
              カウンセリングに申し込む
            </a>
          </div>

          {/* IT・企業コンサルティング */}
          <div className="service-card">
            <div className="service-icon">IT/企</div>
            <h3 className="service-title">IT・企業コンサルティング</h3>
            <div className="service-desc">
              <p>「従業員の離職が止まらない」「業績を上げるための仕組みづくりがわからない」「IT化を進めたいがどこから手をつければいいか…」</p>
              <p style={{ marginTop: '10px' }}>こうした企業のリアルな課題に対し、「人（心）」と「仕組み（IT）」の両面からアプローチし、根本的な解決へ導きます。現場の悩みに深く寄り添いながら、経営層の目標達成をサポートする、頼れる壁打ち相手・伴走者としてご活用ください。</p>
            </div>
            <a 
              href="https://coconala.com/services/4175615" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
            >
              詳細を見る (ココナラ)
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
