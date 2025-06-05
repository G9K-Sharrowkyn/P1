import React from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

const CollectionPage = ({ user }) => {
    if (!user) {
        return <Navigate to="/login" />;
    }
    return (
        <div className="p-4 text-white">
            <h2 className="text-xl font-bold mb-4">Your Collection</h2>
            {user.collection.length === 0 && <p>You don't have any cards yet.</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {user.collection.map((card, idx) => (
                    <img key={idx} src={card.image} alt={card.name} className="w-full h-auto rounded shadow" />
                ))}
            </div>
        </div>
    );
};

export default connect(state => ({ user: state.auth.user }))(CollectionPage);
