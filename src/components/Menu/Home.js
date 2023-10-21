import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/Home.css';

const Home = () => {
  return (
    <div className="page">
      <section>
        <h6>Home</h6>
        <div className="button-container">
          <Link to="/home-main" className="read-article-button">
            Przejdź do artykułu
          </Link>
        </div>
      </section>
    </div>
  );
}

  export default Home;
