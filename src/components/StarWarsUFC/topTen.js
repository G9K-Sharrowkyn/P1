import peopleData from './peopleData.js';

const getTopTenPeople = (names) => {
    return names.map(name => {
        return peopleData.find(p => p.name === name);
    }).filter(p => p != null);
};

export default getTopTenPeople;