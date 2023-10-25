import React from 'react';
import '../../assets/css/Facebook.css';

const Facebook = () => {
    const facebookLink = 'https://www.facebook.com/InvincibleCharlesXII';

    return (
        <div className="page">
            <section>
                <h5>
                    <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="facebook-link">
                        Klik!
                    </a>
                </h5>
            </section>
        </div>
    );
}

export default Facebook;
