import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Home.css';

const Articles = () => {
  return (
    <div className="articles-page">
      <section>
        <h3>Artykuły</h3>
          <div className="button-container">
          <Link to="/malcadorarticle" className="malcador-article-button">
            Malcador Pieczętnik
          </Link>
          <Link to="/imperatorarticle" className="imperator-article-button">
            Imperator
          </Link>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          </div>
        </div>
      </section>
    </div>
  );
}

  export default Articles;
