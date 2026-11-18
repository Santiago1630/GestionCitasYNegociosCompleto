const router = require('express').Router();
const service = require('../services/UsuarioService');
router.post('/registro', async (req,res) => { try { const usuario = await service.registrar(req.body); res.status(201).json({mensaje:'Cuenta creada con éxito. Ahora puedes iniciar sesión.',usuario}); } catch(e) { res.status(400).json({error:e.message}); } });
router.post('/login', async (req,res) => { try { const usuario = await service.iniciarSesion(req.body); res.json({mensaje:'Inicio de sesión correcto',...usuario}); } catch(e) { res.status(401).json({error:e.message}); } });
module.exports = router;
