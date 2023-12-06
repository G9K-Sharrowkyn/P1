import React from 'react';
import getTopTenPeople from './topTen';
import '../../assets/css/topTen.css'; 

const TopTenList = () => {
    const topTenNames = ["Luke Skywalker", "Darth Caedus", "Darth Sidious"];
    const topTenPeople = getTopTenPeople(topTenNames);

    return (
        <div className="top-page">
            <section>
                <h2>List</h2>
                {topTenPeople.map((person, index) => (
                    <div key={index} className={person.className}>
                        <h3>{person.name}</h3>
                        <div className="profile-pic"></div>
                        <p>Position: {person.position.join(', ')}</p>
                        <p>Tags: {person.tags.join(', ')}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default TopTenList;