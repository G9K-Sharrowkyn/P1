import React from 'react';
import '../../assets/css/topTen.css'; 
import peopleData from './peopleData.js';

const TopTenList = () => {
    const getTopTenPeople = (names) => {
        return names.map(name => {
            return peopleData.find(p => p.name === name);
        }).filter(p => p != null);
    };

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