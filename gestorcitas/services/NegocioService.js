const repository = require('../repositories/NegocioRepository');
function requerido(valor, nombre) {
    if (typeof valor !== 'string' || !valor.trim()) throw new Error(`${nombre} es obligatorio`);
    return valor.trim();
}
function id(valor, nombre) {
    const n = Number(valor);
    if (!Number.isSafeInteger(n) || n <= 0) throw new Error(`${nombre} inválido`);
    return n;
}
function validar(datos) {
    return {
        nombre: requerido(datos.nombre, 'El nombre'),
        tipoNegocio: requerido(datos.tipoNegocio, 'El tipo de negocio'),
        direccion: requerido(datos.direccion, 'La dirección'),
        telefono: requerido(datos.telefono, 'El teléfono'),
        cantidadEmpleados: id(datos.cantidadEmpleados, 'Cantidad de empleados'),
        idUsuario: id(datos.idUsuario, 'Usuario')
    };
}

// Relaciones entre negocios de la misma categoría, calculadas desde datos reales.
// BFS permite ofrecer negocios relacionados, sin tablas ni registros ficticios.
function relacionados(registros, origen) {
    const nodos = new Map(registros.map(n => [Number(n.id_negocio), n]));
    if (!nodos.has(origen)) return [];
    const grupos = new Map();
    for (const n of registros) {
        const categoria = String(n.tipo_negocio || '').trim().toLowerCase();
        if (!grupos.has(categoria)) grupos.set(categoria, []);
        grupos.get(categoria).push(Number(n.id_negocio));
    }
    const visitados = new Set([origen]);
    const cola = [origen];
    const resultado = [];
    for (let i = 0; i < cola.length; i++) {
        const actual = nodos.get(cola[i]);
        const vecinos = grupos.get(String(actual.tipo_negocio || '').trim().toLowerCase()) || [];
        for (const vecino of vecinos) {
            if (visitados.has(vecino)) continue;
            visitados.add(vecino);
            cola.push(vecino);
            resultado.push(nodos.get(vecino));
        }
    }
    return resultado;
}
module.exports = {
    async crearNegocio(datos) { const negocio = validar(datos); await repository.crearNegocio(negocio); return negocio; },
    async obtenerNegocios(filtros = {}) {
        if (filtros.idNegocio) return repository.obtenerNegocioPorId(id(filtros.idNegocio, 'Negocio'));
        if (filtros.idUsuario) return repository.obtenerNegociosPorUsuario(id(filtros.idUsuario, 'Usuario'));
        const todos = await repository.obtenerNegocios();
        return filtros.relacionadosCon ? relacionados(todos, id(filtros.relacionadosCon, 'Negocio')) : todos;
    },
    async actualizarNegocio(datos) {
        const negocio = { ...validar(datos), idNegocio: id(datos.idNegocio, 'Negocio') };
        await repository.actualizarNegocio(negocio);
        return negocio;
    },
    eliminarNegocio: (negocio, usuario) => repository.eliminarNegocio(id(negocio, 'Negocio'), id(usuario, 'Usuario')),
    relacionados
};
