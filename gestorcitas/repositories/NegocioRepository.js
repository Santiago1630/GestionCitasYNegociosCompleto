const db = require('../config/database');

const negocioRepository = {
    async crearNegocio(negocio) {
        const sql = `
            INSERT INTO negocio
            (nombre, tipo_negocio, direccion, telefono, cantidad_empleados, id_usuario)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        await db.query(sql, [
            negocio.nombre.trim(),
            negocio.tipoNegocio.trim(),
            negocio.direccion.trim(),
            negocio.telefono.trim(),
            negocio.cantidadEmpleados,
            negocio.idUsuario
        ]);
    },

    async obtenerNegocios() {
        const sql = 'SELECT * FROM negocio ORDER BY id_negocio ASC';
        const resultado = await db.query(sql);
        return resultado.rows;
    },

    async obtenerNegociosPorUsuario(idUsuario) {
        const sql = `
            SELECT * FROM negocio
            WHERE id_usuario = $1
            ORDER BY id_negocio ASC
        `;
        const resultado = await db.query(sql, [idUsuario]);
        return resultado.rows;
    },

    async obtenerNegocioPorId(idNegocio) {
        const sql = 'SELECT * FROM negocio WHERE id_negocio = $1';
        const resultado = await db.query(sql, [idNegocio]);
        return resultado.rows[0] || null;
    },

    async obtenerNegocioPorIdYUsuario(idNegocio, idUsuario) {
        const sql = `
            SELECT * FROM negocio
            WHERE id_negocio = $1 AND id_usuario = $2
        `;
        const resultado = await db.query(sql, [idNegocio, idUsuario]);
        return resultado.rows[0] || null;
    },

    async actualizarNegocio(negocio) {
        const sql = `
            UPDATE negocio
            SET nombre=$1,
                tipo_negocio=$2,
                direccion=$3,
                telefono=$4,
                cantidad_empleados=$5
            WHERE id_negocio=$6 AND id_usuario=$7
        `;

        await db.query(sql, [
            negocio.nombre.trim(),
            negocio.tipoNegocio.trim(),
            negocio.direccion.trim(),
            negocio.telefono.trim(),
            negocio.cantidadEmpleados,
            negocio.idNegocio,
            negocio.idUsuario
        ]);
    },

    async eliminarNegocio(idNegocio, idUsuario) {
        const sql = 'DELETE FROM negocio WHERE id_negocio = $1 AND id_usuario = $2';
        await db.query(sql, [idNegocio, idUsuario]);
    }
};

module.exports = negocioRepository;
