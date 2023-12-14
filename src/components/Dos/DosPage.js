import React from 'react';
// import DosComponent from './Dos.js';
import CardInfo from '../Cards/CardInfo';
import ExplosiveButtonComponent from '../Cards/BoosterAnimation';

import '../../assets/css/DosComponent.css';
import '../../assets/css/Registration.css'

const DosPage = () => {
    return (
        <div className="DosPage">
            <section>
                {/* <DosComponent /> */}
                <CardInfo />
                <ExplosiveButtonComponent></ExplosiveButtonComponent>
            </section>
        </div>
    );
};

export default DosPage;
