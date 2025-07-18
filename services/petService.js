import petRepository from '../repositories/petRepository.js';

async function getAllPets() {
    return await petRepository.getPets();
}

async function addPet(pet) {
    const pets = await petRepository.getPets();
    const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
    const newPet = { ...pet, id: newId, ownerId: null };
    pets.push(newPet);
    await petRepository.savePets(pets);
    return newPet;
}

async function adoptPet(petId, ownerId) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(petId));
    if (index === -1) throw new Error('Mascota no encontrada');
    if (pets[index].ownerId !== null) throw new Error('Mascota ya adoptada');
    pets[index].ownerId = ownerId;
    await petRepository.savePets(pets);
    return pets[index];
}

export default {
    getAllPets,
    addPet,
    adoptPet
}; 