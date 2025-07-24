import { ObjectId } from 'mongodb';
import connectDB from '../db.js';

async function getHeroes() {
    const db = await connectDB();
    return await db.collection('superheroes').find().toArray();
}

async function insertHero(hero) {
    const db = await connectDB();
    // Generar un id incremental
    const lastHero = await db.collection('superheroes').find().sort({ id: -1 }).limit(1).toArray();
    const newId = lastHero.length > 0 ? lastHero[0].id + 1 : 1;
    hero.id = newId;
    const result = await db.collection('superheroes').insertOne(hero);
    return { ...hero, _id: result.insertedId };
}

async function updateHero(id, updatedHero) {
    const db = await connectDB();
    const filter = { id: Number(id) };
    const result = await db.collection('superheroes').findOneAndUpdate(
        filter,
        { $set: updatedHero },
        { returnDocument: 'after', returnOriginal: false }
    );
    if (result.value) {
        return result.value;
    } else {
        // Buscar el héroe actualizado manualmente
        return await db.collection('superheroes').findOne(filter);
    }
}

async function updateHeroByOwnerId(ownerId, updatedHero) {
    const db = await connectDB();
    console.log('ownerId recibido:', ownerId);
    // Buscar por ownerId string
    let filter = { ownerId: ownerId };
    let result = await db.collection('superheroes').findOneAndUpdate(
        filter,
        { $set: updatedHero },
        { returnDocument: 'after' }
    );
    if (result && result.value) {
        console.log('Encontrado por ownerId string:', result.value);
        return result.value;
    }
    // Buscar por ownerId como ObjectId
    try {
        filter = { ownerId: new ObjectId(ownerId) };
        result = await db.collection('superheroes').findOneAndUpdate(
            filter,
            { $set: updatedHero },
            { returnDocument: 'after' }
        );
        if (result && result.value) {
            console.log('Encontrado por ownerId ObjectId:', result.value);
            return result.value;
        }
    } catch (e) {}
    // Buscar por _id como ObjectId
    try {
        filter = { _id: new ObjectId(ownerId) };
        result = await db.collection('superheroes').findOneAndUpdate(
            filter,
            { $set: updatedHero },
            { returnDocument: 'after' }
        );
        if (result && result.value) {
            console.log('Encontrado por _id ObjectId:', result.value);
            return result.value;
        }
    } catch (e) {}
    console.log('No se encontró ningún héroe con ese ownerId o _id');
    return null;
}

async function deleteHero(id) {
    const db = await connectDB();
    const result = await db.collection('superheroes').deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
        throw new Error('Héroe no encontrado');
    }
    return { message: 'Héroe eliminado' };
}

export default {
    getHeroes,
    insertHero,
    updateHero,
    deleteHero,
    updateHeroByOwnerId
};
