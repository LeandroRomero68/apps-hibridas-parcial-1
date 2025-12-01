import bcrypt from "bcryptjs";

class passManager {
    salt = '';
    constructor(salt = 10) {
        this.salt = salt;
    }

    hashPassword(password) {
        if (!password) {
            console.log('No hay contraseña');
            return;
        }
        const saltPass = bcrypt.genSaltSync(this.salt);
        password = bcrypt.hashSync(password, saltPass);
        return password;
    }

    comparePassword(plainPassword, hashedPassword) {
        if (!plainPassword || !hashedPassword) return false;
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }
}

export default passManager;
