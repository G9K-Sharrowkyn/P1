import React, { useState } from "react";
import { Link } from "react-router-dom";
import { defaultRoutes } from '../../Routes';
import CircleSVG from '../Navigation/CircleSVG';
import '../../assets/css/Home.css';

function Home() {
  const [pathname] = useState("/");

  return (
    <div className="page">
            <div className="circle-container">
              <CircleSVG />
            </div>
            <nav style={{ margin:10 }} className = "nav">
            <Link to={defaultRoutes.ARTICLES} className= {`articles ${pathname === "/articles" ? `selected` : ``}`} >
                Articles
            </Link>
            </nav>
</div>

  )
};

export default Home;
