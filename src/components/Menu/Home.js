import React, { useState } from "react";
import { Link } from "react-router-dom";
import { defaultRoutes } from '../../Routes';
import CircleSVG from '../Navigation/CircleSVG';
import Header from "../Header/Header.js";
import Navigation from "../Navigation/Navigation.js";
import MouseTracker from '../../components/MouseChase/MouseTracker';
import ClickCounter from '../../components/MouseChase/ClickCounter.js';
import '../../assets/css/Home.css';

function Home() {
  const [pathname] = useState("/");

  return (
    <div className="page">
            <div className="circle-container">
            <Header />
            <Navigation />
            <CircleSVG />
            <ClickCounter />
            {/* <MouseTracker /> */}
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
