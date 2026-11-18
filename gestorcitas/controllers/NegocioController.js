const router = require('express').Router();
const service = require('../services/NegocioService');
router.post('/negocios', async (req,res) => { try { const negocio = await service.crearNegocio(req.body); res.status(201).json({mensaje:'Negocio creado con éxito',negocio}); } catch(e) { res.status(400).json({error:e.message}); } });
router.get('/negocios', async (req,res) => { try { const negocios = await service.obtenerNegocios(req.query); if (req.query.idNegocio && !negocios) return res.status(404).json({error:'Negocio no encontrado'}); res.json(negocios); } catch(e) { res.status(400).json({error:e.message}); } });
router.put('/negocios', async (req,res) => { try { const negocio = await service.actualizarNegocio({...req.body,idNegocio:req.query.idNegocio}); res.json({mensaje:'Negocio actualizado correctamente',negocio}); } catch(e) { res.status(400).json({error:e.message}); } });
router.delete('/negocios', async (req,res) => { try { await service.eliminarNegocio(req.query.idNegocio,req.query.idUsuario); res.json({mensaje:'Negocio eliminado'}); } catch(e) { res.status(400).json({error:e.message}); } });
module.exports = router;
