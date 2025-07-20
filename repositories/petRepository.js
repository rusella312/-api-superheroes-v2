import { ObjectId } from 'mongodb';
import Pet from '../models/petModel.js';
import connectDB from '../db.js';

async function getPets() {
    const db = await connectDB();
    const petsData = await db.collection('pets').find().toArray();
    return petsData.map(pet => new Pet(
        pet.id,
        pet.name,
        pet.type,
        pet.superPower,
        pet.ownerId,
        pet.felicidad !== undefined ? pet.felicidad : 50,
        pet.hambre !== undefined ? pet.hambre : 50,
        pet.energia !== undefined ? pet.energia : 50,
        pet.limpieza !== undefined ? pet.limpieza : 50,
        pet.salud !== undefined ? pet.salud : "sano",
        pet.actividades !== undefined ? pet.actividades : []
    ));
}

async function insertPet(pet) {
    const db = await connectDB();
    const lastPet = await db.collection('pets').find().sort({ id: -1 }).limit(1).toArray();
    const newId = lastPet.length > 0 ? lastPet[0].id + 1 : 1;
    const newPet = { ...pet, id: newId, ownerId: null };
    await db.collection('pets').insertOne(newPet);
    return newPet;
}

async function updatePetOwner(petId, ownerId) {
    const db = await connectDB();
    const result = await db.collection('pets').findOneAndUpdate(
        { id: parseInt(petId) },
        { $set: { ownerId: ownerId } },
        { returnDocument: 'after' }
    );
    return result;
}

async function getPetById(petId) {
    const db = await connectDB();
    const pet = await db.collection('pets').findOne({ id: parseInt(petId) });
    return pet;
}

async function getAvailablePets() {
    const db = await connectDB();
    // Mascotas sin dueño (ownerId null o no existe)
    return await db.collection('pets').find({ $or: [ { ownerId: null }, { ownerId: { $exists: false } } ] }).toArray();
}

async function getPetsByOwner(ownerId) {
    const db = await connectDB();
    // Busca tanto por ObjectId como por string
    return await db.collection('pets').find({
        $or: [
            { ownerId: new ObjectId(ownerId) },
            { ownerId: ownerId }
        ]
    }).toArray();
}

// --- Actividades ---
async function updatePetActivity(petId, updateFields, actividad) {
    const db = await connectDB();
    console.log("Buscando mascota con id:", petId, "parseInt:", parseInt(petId));
    const result = await db.collection('pets').findOneAndUpdate(
        { id: parseInt(petId) },
        {
            $set: updateFields,
            $push: { actividades: actividad }
        },
        { returnDocument: 'after' }
    );
    console.log("Resultado de findOneAndUpdate:", result);
    return result;
}

async function setPetSick(petId, actividad) {
    const db = await connectDB();
    const result = await db.collection('pets').findOneAndUpdate(
        { id: parseInt(petId) },
        {
            $set: { salud: "enfermo" },
            $push: { actividades: actividad }
        },
        { returnDocument: 'after' }
    );
    return result;
}

export default {
    getPets,
    insertPet,
    updatePetOwner,
    getPetById,
    updatePetActivity,
    setPetSick,
    getAvailablePets,
    getPetsByOwner
}; 