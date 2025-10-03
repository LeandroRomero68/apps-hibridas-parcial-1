import bcrypt from "bcryptjs";

class passManager {
    salt = '';
    constructor(salt = 10) {
        this.salt = salt;
    }

    hashPassword(password) {
        if(!password) {
            console.log('No hay cotraseña');
            return;
        }
        const saltPass = bcrypt.genSaltSync(this.salt);
        password = bcrypt.hashSync(password, saltPass);
        return password;
    }

}

export default passManager;