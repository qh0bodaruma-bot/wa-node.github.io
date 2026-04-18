import React from 'react';
import './Concept.css';
import avatarImg from '../assets/avatar.png';

const Concept: React.FC = () => {
  return (
    <section id="concept" className="section concept">
      <div className="container">
        <h2 className="section-title">Concept</h2>
        
        <div className="concept-content">
          <div className="concept-profile">
            {/* 似顔絵画像を src/assets に移動して import して表示 */}
            <img src={avatarImg} alt="和-Node 代表" className="profile-image" />
          </div>
          <div className="concept-text-area">
            <p className="concept-text">
              痛みも、孤独も、ITも、ひとりで抱えてきた経験から
            </p>
            <h3 className="concept-highlight">
              「心とITの両方がわかる人間」として<br />
              関わりたいと思っています。
            </h3>
            <p className="concept-desc">
              私たちは、技術の力（IT）と心のケア（心理カウンセリング）という、
              一見異なる二つの領域を繋ぐ「Node（結節点）」でありたいと考えています。
              論理的な分析力と、深く寄り添う共感力。
              その両方を持ち合わせることで、企業が抱える複雑な課題から、
              個人が抱える心のモヤモヤまで、根本から解決へと導きます。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Concept;
