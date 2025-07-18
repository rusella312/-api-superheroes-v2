import fs from 'fs-extra';
import Pet from '../models/petModel.js';

const filePath = './pets.json';

async function getPets() {
    try {
        const data = await fs.readJson(filePath);
        return data.map(pet => {
            return new Pet(
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
            );
        });
    } catch (error) {
        return [];
    }
}

async function savePets(pets) {
    try {
        await fs.writeJson(filePath, pets);
    } catch (error) {
        console.error(error);
    }
}

export default {
    getPets,
    savePets
}; 