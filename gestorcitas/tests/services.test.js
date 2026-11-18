const test = require('node:test');
const assert = require('node:assert/strict');
const citas = require('../services/CitaService');
const negocios = require('../services/NegocioService');
test('citas: fechas en orden y varias citas por día', () => {
 const datos = [{fecha:'2026-12-03',hora:'11:00'},{fecha:'2026-12-01',hora:'12:00'},{fecha:'2026-12-03',hora:'09:00'}];
 assert.deepEqual(citas.ordenarPorFecha(datos).map(x=>x.hora), ['12:00','09:00','11:00']);
});
test('negocios: recorrido por categoría, sin incluir el origen', () => {
 const datos = [{id_negocio:1,tipo_negocio:'Barbería'},{id_negocio:2,tipo_negocio:'barbería'},{id_negocio:3,tipo_negocio:'Spa'}];
 assert.deepEqual(negocios.relacionados(datos,1).map(x=>x.id_negocio),[2]);
});
