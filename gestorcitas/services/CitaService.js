const repository = require('../repositories/CitaRepository');
const negocios = require('../repositories/NegocioRepository');

function texto(valor, campo) {
    if (typeof valor !== 'string' || !valor.trim()) throw new Error(`${campo} es obligatorio`);
    return valor.trim();
}
function entero(valor, campo) {
    const numero = Number(valor);
    if (!Number.isSafeInteger(numero) || numero <= 0) throw new Error(`${campo} inválido`);
    return numero;
}
function fechaISO(valor) {
    const fecha = texto(valor, 'La fecha');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || Number.isNaN(Date.parse(`${fecha}T00:00:00Z`)) || new Date(`${fecha}T00:00:00Z`).toISOString().slice(0,10) !== fecha) throw new Error('Fecha inválida (AAAA-MM-DD)');
    return fecha;
}
function normalizar(cita) {
    const hora = texto(cita.hora, 'La hora');
    if (!/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(hora)) throw new Error('Hora inválida');
    return {
        nombreCliente: texto(cita.nombreCliente, 'El nombre del cliente'),
        telefono: texto(cita.telefono, 'El teléfono'),
        tipoServicio: texto(cita.tipoServicio, 'El tipo de servicio'),
        fecha: fechaISO(cita.fecha), hora,
        idNegocio: entero(cita.idNegocio, 'Negocio'),
        estado: cita.estado || 'Pendiente'
    };
}

// Índice temporal por fecha, construido con registros persistidos; no sustituye SQL Server.
function ordenarPorFecha(registros) {
    let raiz = null;
    for (const cita of registros) {
        const clave = String(cita.fecha).slice(0, 10);
        const insertar = nodo => {
            if (!nodo) return { clave, citas: [cita], izquierda: null, derecha: null };
            if (clave === nodo.clave) nodo.citas.push(cita);
            else if (clave < nodo.clave) nodo.izquierda = insertar(nodo.izquierda);
            else nodo.derecha = insertar(nodo.derecha);
            return nodo;
        };
        raiz = insertar(raiz);
    }
    const resultado = [];
    const recorrer = nodo => {
        if (!nodo) return;
        recorrer(nodo.izquierda);
        resultado.push(...nodo.citas.sort((a,b) => String(a.hora).localeCompare(String(b.hora))));
        recorrer(nodo.derecha);
    };
    recorrer(raiz);
    return resultado;
}

module.exports = {
    async crearCita(datos) {
        const cita = normalizar(datos);
        if (!await negocios.obtenerNegocioPorId(cita.idNegocio)) throw new Error('El negocio no existe');
        await repository.crearCita(cita);
        return cita;
    },
    async obtenerCitas(filtros = {}) {
        if (filtros.idCita) return repository.obtenerCitaPorId(entero(filtros.idCita, 'Cita'));
        if (filtros.telefono) return repository.obtenerCitasPorTelefono(texto(filtros.telefono, 'El teléfono'));
        const citas = filtros.idNegocio
            ? await repository.obtenerCitasPorNegocio(entero(filtros.idNegocio, 'Negocio'))
            : await repository.obtenerCitas();
        const ordenadas = ordenarPorFecha(citas);
        return filtros.fecha ? ordenadas.filter(c => String(c.fecha).slice(0,10) === fechaISO(filtros.fecha)) : ordenadas;
    },
    obtenerCitaPorId: id => repository.obtenerCitaPorId(entero(id, 'Cita')),
    async actualizarCita(datos) {
        const idCita = entero(datos.idCita, 'Cita');
        const cita = { ...normalizar(datos), idCita };
        if (!await negocios.obtenerNegocioPorId(cita.idNegocio)) throw new Error('El negocio no existe');
        await repository.actualizarCita(cita);
        return cita;
    },
    eliminarCita: id => repository.eliminarCita(entero(id, 'Cita')),
    ordenarPorFecha
};
