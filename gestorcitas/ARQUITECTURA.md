# Arquitectura y decisiones

Flujo: `public/` (vista) → `controllers/` (HTTP) → `services/` (reglas y consultas en memoria) → `repositories/` (SQL Server) → `config/database.js`.

- **Citas**: `CitaService.ordenarPorFecha` construye un árbol binario de búsqueda temporal a partir de citas existentes; el recorrido inorden devuelve las citas cronológicamente. Se reconstruye en cada lectura y no reemplaza un índice SQL; para grandes volúmenes es preferible ordenar/paginar en SQL. El árbol no está balanceado y puede degradarse a O(n²) con fechas ya ordenadas.
- **Negocios**: `NegocioService.relacionados` construye una adyacencia implícita a partir de la categoría `tipo_negocio`, y la recorre en anchura. La ruta `GET /api/negocios?relacionadosCon=ID` devuelve otros negocios de esa categoría. No se inventan servicios ni relaciones que el esquema original no tenga.
- **Persistencia**: no hay registros de prueba automáticos ni tablas nuevas. Los formularios originales crean los datos.
- **Compatibilidad**: se conservan las rutas existentes y sus cuerpos de respuesta. La vista no incluye laboratorio ni secciones académicas.
- **Seguridad pendiente**: el proyecto original almacena contraseñas sin hash y confía en identificadores de usuario enviados por el cliente. Antes de producción hay que implementar hash (bcrypt/argon2), autenticación, autorización, gestión de secretos y control de concurrencia de reservas. La refactorización no afirma resolver esos problemas.
- **Base de datos**: `config/database.js` conserva los ajustes originales; deben moverse a variables de entorno antes de desplegar. No se verificó una conexión SQL Server real.

Pruebas: `npm test`. Ejecución: `npm start` desde `gestorcitas`.
