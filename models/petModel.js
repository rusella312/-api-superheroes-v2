class Pet {
    constructor(id, name, type, superPower, ownerId = null, felicidad = 50, hambre = 50, energia = 50, limpieza = 50, salud = "sano", actividades = []) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.superPower = superPower;
        this.ownerId = ownerId;
        this.felicidad = felicidad;
        this.hambre = hambre;
        this.energia = energia;
        this.limpieza = limpieza;
        this.salud = salud;
        this.actividades = actividades;
    }
}

export default Pet; 