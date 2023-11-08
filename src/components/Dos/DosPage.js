import React from 'react';
import DosComponent from './Dos.js';
import '../../assets/css/DosComponent.css';
import '../../assets/css/Registration.css'

const DosPage = () => {
    return (
        <div className="DosPage">
            <section>
                <h1>DOS Emulator</h1>
                <DosComponent />
            </section>
        </div>
    );
};

export default DosPage;
