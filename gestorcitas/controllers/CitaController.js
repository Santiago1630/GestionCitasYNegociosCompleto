const router = require('express').Router();
const service = require('../services/CitaService');
router.post('/citas', async (req,res) => { try { const cita = await service.crearCita(req.body); res.status(201).json({ mensaje:'Cita creada correctamente', cita }); } catch(e) { res.status(400).json({error:e.message}); } });
router.get('/citas', async (req,res) => { try { res.json(await service.obtenerCitas(req.query)); } catch(e) { res.status(400).json({error:e.message}); } });
router.put('/citas', async (req,res) => { try { const cita = await service.actualizarCita({...req.body,idCita:req.query.idCita}); res.json({mensaje:'Cita actualizada correctamente',cita}); } catch(e) { res.status(400).json({error:e.message}); } });
router.delete('/citas', async (req,res) => { try { await service.eliminarCita(req.query.idCita); res.json({mensaje:'Cita eliminada'}); } catch(e) { res.status(400).json({error:e.message}); } });
module.exports = router;
