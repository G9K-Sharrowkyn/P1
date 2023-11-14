import React, { useState } from 'react';
import DraggableTodoList from '../Navigation/TODOList';
import '../../assets/css/Facebook.css';

const Facebook = () => {
    const [showTodoList, setShowTodoList] = useState(false);
    const facebookLink = 'https://www.facebook.com/InvincibleCharlesXII';

    const toggleTodoList = () => {
        setShowTodoList(!showTodoList);
    };

    return (
        <div className="page">
            <section>
                <h5>
                    <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="facebook-link">
                        Klik!
                    </a>
                </h5>
                <button onClick={toggleTodoList}>
                    {showTodoList ? 'TODOList' : 'TODOList'}
                </button>
                {showTodoList && <DraggableTodoList />}
            </section>
        </div>
    );
}

export default Facebook;