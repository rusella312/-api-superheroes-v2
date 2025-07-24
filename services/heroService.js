import heroRepository from '../repositories/heroRepository.js';

async function getAllHeroes() {
    return await heroRepository.getHeroes();
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }
    return await heroRepository.insertHero(hero);
}

async function updateHero(id, updatedHero) {
    return await heroRepository.updateHero(id, updatedHero);
}

async function deleteHero(id) {
    return await heroRepository.deleteHero(id);
}

async function updateHeroByOwnerId(ownerId, updatedHero) {
    return await heroRepository.updateHeroByOwnerId(ownerId, updatedHero);
}

export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    updateHeroByOwnerId
};
