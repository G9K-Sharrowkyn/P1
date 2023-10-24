import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section>
        <h3>Artykuły</h3>
          <div className="button-container">
            {/* <b className="malcadorarticle-text">Malcador Pieczętnik - Bohater Imperium</b> */}
          <Link to="/malcadorarticle" className="malcador-article-button">
            Malcador Pieczętnik
          </Link>
            {/* <b className="imperatorarticle-text">Bóg Imperator Ludzkości</b> */}
          <Link to="/imperatorarticle" className="imperator-article-button">
            Imperator
          </Link>
        </div>
      </section>
    </div>
  );
}

  export default Home;
