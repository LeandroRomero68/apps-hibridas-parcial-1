import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
class Conexion {
    URI_DB = process.env.URI_DB;
    db = null;
    async createConnection() {
       try {
            await mongoose.connect(this.URI_DB);
            this.db = mongoose.connection;
            console.log('Conexión a la DB establecida')
        } catch (err) {
            console.error('Hubo un error al intentar conectar con la DB', err);
        }    
    }

    async getConexion() {
        if(!this.db) {
            await this.createConnection();
        }
        return this.db;
    }
}

export default Conexion;