import petRepository from '../repositories/petRepository.js';
import { ObjectId } from 'mongodb';
import connectDB from '../db.js';

async function getAllPets() {
    const pets = await petRepository.getPets();
    const db = await connectDB();
    const ownerIds = pets
        .filter(p => p.ownerId)
        .map(p => typeof p.ownerId === 'string' ? new ObjectId(p.ownerId) : p.ownerId);
    let owners = [];
    if (ownerIds.length > 0) {
        owners = await db.collection('superheroes').find({ _id: { $in: ownerIds } }).toArray();
    }
    return pets.map(pet => {
        if (pet.ownerId) {
            const owner = owners.find(o => o._id.toString() === pet.ownerId.toString());
            return {
                ...pet,
                owner: owner ? { name: owner.name, alias: owner.alias } : null
            };
        }
        return pet;
    });
}

async function addPet(pet) {
    return await petRepository.insertPet(pet);
}

async function adoptPet(petId, ownerId) {
    const ownerObjectId = ownerId ? new ObjectId(ownerId) : null;
    const pet = await petRepository.getPetById(petId);
    if (!pet) throw new Error('Mascota no encontrada');
    if (pet.ownerId !== null) throw new Error('Mascota ya adoptada');
    const updatedPet = await petRepository.updatePetOwner(petId, ownerObjectId);
    return updatedPet;
}

async function getPetById(petId) {
    const pet = await petRepository.getPetById(petId);
    if (pet && pet.ownerId) {
        const db = await connectDB();
        const owner = await db.collection('superheroes').findOne({ _id: typeof pet.ownerId === 'string' ? new ObjectId(pet.ownerId) : pet.ownerId });
        return {
            ...pet,
            owner: owner ? { name: owner.name, alias: owner.alias } : null
        };
    }
    return pet;
}

async function getAvailablePets() {
    return await petRepository.getAvailablePets();
}

async function getPetsByOwner(ownerId) {
    return await petRepository.getPetsByOwner(ownerId);
}

// --- Actividades ---
async function playWithPet(petId, ownerId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.ownerId || pet.ownerId.toString() !== ownerId) throw new Error('No tienes acceso a esta mascota');
    if (pet.salud === 'enfermo') throw new Error('La mascota está enferma y no puede jugar. Debe ser curada primero.');
    if (pet.energia < 10) throw new Error('La mascota no tiene suficiente energía para jugar');
    const felicidad = Math.min(100, (pet.felicidad || 0) + 10);
    const energia = Math.max(0, (pet.energia || 0) - 10);
    const actividad = { tipo: 'jugar', fecha: new Date().toISOString(), felicidadAumentada: 10, energiaConsumida: 10 };
    return await petRepository.updatePetActivity(petId, { felicidad, energia }, actividad);
}

async function sleepPet(petId, ownerId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.ownerId || pet.ownerId.toString() !== ownerId) throw new Error('No tienes acceso a esta mascota');
    if (pet.salud === 'enfermo') throw new Error('La mascota está enferma y no puede dormir. Debe ser curada primero.');
    const energia = Math.min(100, (pet.energia || 0) + 20);
    const hambre = Math.max(0, (pet.hambre || 0) - 10);
    const actividad = { tipo: 'dormir', fecha: new Date().toISOString(), energiaAumentada: 20, hambreReducida: 10 };
    return await petRepository.updatePetActivity(petId, { energia, hambre }, actividad);
}

async function feedPet(petId, ownerId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.ownerId || pet.ownerId.toString() !== ownerId) throw new Error('No tienes acceso a esta mascota');
    if (pet.salud === 'enfermo') throw new Error('La mascota está enferma y no puede ser alimentada. Debe ser curada primero.');
    if (pet.hambre === 0 && pet.salud === 'sano') {
        const actividad = { tipo: 'alimentar', fecha: new Date().toISOString(), resultado: 'enfermo por hambre en 0' };
        await petRepository.setPetSick(petId, actividad);
        throw new Error('La mascota está enferma porque el hambre es 0');
    }
    const felicidad = Math.min(100, (pet.felicidad || 0) + 10);
    const hambre = Math.max(0, (pet.hambre || 0) - 10);
    const actividad = { tipo: 'alimentar', fecha: new Date().toISOString(), felicidadAumentada: 10, hambreReducida: 10 };
    return await petRepository.updatePetActivity(petId, { felicidad, hambre }, actividad);
}

async function curePet(petId, ownerId) {
    const pet = await petRepository.getPetById(petId);
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.ownerId || pet.ownerId.toString() !== ownerId) throw new Error('No tienes acceso a esta mascota');
    if (pet.salud === 'enfermo') {
        const actividad = { tipo: 'curar', fecha: new Date().toISOString(), resultado: 'curada' };
        return await petRepository.updatePetActivity(petId, { salud: 'sano', hambre: 50, energia: 50 }, actividad);
    }
    return pet;
}

export default {
    getAllPets,
    addPet,
    adoptPet,
    getPetById,
    playWithPet,
    feedPet,
    sleepPet,
    curePet,
    getAvailablePets,
    getPetsByOwner
}; 