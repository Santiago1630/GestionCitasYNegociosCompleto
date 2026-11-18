const repository = require('../repositories/UsuarioRepository');
function correoValido(valor) {
    const correo = String(valor || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw new Error('Correo inválido');
    return correo;
}
module.exports = {
    async registrar({ nombre, correo, contrasena }) {
        if (typeof nombre !== 'string' || !nombre.trim()) throw new Error('Nombre obligatorio');
        if (typeof contrasena !== 'string' || !contrasena) throw new Error('Contraseña obligatoria');
        const limpio = correoValido(correo);
        if (await repository.buscarPorCorreo(limpio)) throw new Error('El correo ya está registrado');
        return repository.crearUsuario({ nombre: nombre.trim(), correo: limpio, contrasena, rol: 'administrador' });
    },
    async iniciarSesion({ correo, contrasena }) {
        const usuario = await repository.buscarPorCorreo(correoValido(correo));
        if (!usuario || usuario.contrasena !== contrasena) throw new Error('Correo o contraseña incorrectos');
        return { idUsuario: usuario.id_usuario, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
    }
};
