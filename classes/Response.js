class Response {

    generateResponseTrue(res, msg, data) {
        res.status(200).json({msg: msg, data: data});
    }

    generateResponseFalse(res, msg, log, nError, tError = '') {
        res.status(nError).json({msg: msg});
        console.error(log, tError ?? undefined);
    }

    invalidId(res) {
        console.log('El usuario no proporcionó un ID válido');
        res.status(400).json({msg: 'El Id no es válido, debe contener 24 caracteres'});
    }
}


export default Response;