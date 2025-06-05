import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth.actions';

const ProfilePage = ({ user, logout }) => {
    if (!user) {
        return <div className="p-4 text-white">Not logged in</div>;
    }

    return (
        <div className="p-4 text-white">
            <h2 className="text-xl font-bold mb-2">Profile</h2>
            <p>Username: {user.username}</p>
            <p>Points: {user.points}</p>
            <button onClick={logout} className="bg-red-500 hover:bg-red-700 rounded px-4 py-2 mt-4">Logout</button>
        </div>
    );
};

export default connect(state => ({ user: state.auth.user }), { logout })(ProfilePage);
