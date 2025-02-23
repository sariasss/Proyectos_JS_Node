# Proyectos JavaScript & Node.js - Sara Arias Hernández

## 1. Videoclub (04-routes7-cine-context)

**Configuración y Acceso**
- Frontend: [http://localhost:5173](http://localhost:5173)
- API Backend: [http://localhost:3000](http://localhost:3000)
- Base de datos: MongoDB (Puerto 27017)
- Panel MongoDB: [http://localhost:8081](http://localhost:8081)
  - Acceso: admin / 123456

**Instrucciones**
```bash
# Iniciar proyecto
cd ProyectoPeliculas
docker-compose up --build

# Detener proyecto
docker-compose down -v
```

*Nota: La carga inicial de datos puede tomar algunos minutos.*

## 2. Pokédex (ProyectoPokemons)

**Configuración y Acceso**
- Frontend: [http://localhost:5173](http://localhost:5173)
- API Backend: [http://localhost:3000](http://localhost:3000)
- Base de datos: MongoDB (Puerto 27017)
- Panel MongoDB: [http://localhost:8082](http://localhost:8082)
  - Acceso: admin / 123456

**Instrucciones**
```bash
# Iniciar proyecto
cd ProyectoPokemons
docker-compose up --build

# Detener proyecto
docker-compose down -v
```

## 3. Upload (ProyectoUploadData)

**Características**
- Sistema de subida de archivos
- Notificaciones por email (SendGrid)

**Configuración y Acceso**
- API Backend: [http://localhost:3000](http://localhost:3000)

**Configuración SendGrid**
Crear archivo `.env`:
```env
SENDGRID_API_KEY=SG.s1dkLgoURhSdTVFoNeoYJQ.cchmo|||i2qH_BJp5BII9lqacJ-qOewC3YCNIL3hjTZoNM
# Eliminar ||| para usar
```

**Instrucciones**
```bash
# Iniciar proyecto
cd ProyectoUploadData
docker-compose up --build

# Detener proyecto
docker-compose down -v
```

**Requisitos Generales**
- Docker
- Docker Compose
- Node.js