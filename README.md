# CRUD Parametrizado con Node.js y PostgreSQL

## Descripción

Aplicación de ejemplo que expone un servicio REST para administrar registros de clientes (`rut`, `nombre`, `edad`) en una base PostgreSQL. Implementa un backend Node.js con Express y `pg`, utilizando consultas parametrizadas, validación de entradas y respuestas JSON estandarizadas. La arquitectura sigue el patrón MVC y se acompaña de una interfaz web ligera para interactuar con las operaciones básicas: creación, lectura, actualización y eliminación.


---

## 🗂️ Estructura del proyecto

```
/ (raíz del proyecto)
├── controllers/        # Lógica de rutas
├── db/                 # Configuración de la conexión PostgreSQL
├── middlewares/        # Validación, seguridad y manejo de errores
├── models/             # Acceso a la base de datos
├── public/             # Frontend estático (HTML + CSS + JS)
├── routes/             # Definición de rutas y validaciones
├── server.js           # Punto de entrada
└── package.json
```

Cada archivo contiene comentarios explicativos en español para facilitar su
mantenimiento.

---

## ⚙️ Requisitos previos

- Node.js (≥14) y npm.
- Un servidor PostgreSQL accesible en `localhost:5432`.
- Una base de datos llamada **`parametrizadas_DB`** ya creada.
- Usuario con permisos sobre dicha base.

> Las credenciales se transmiten únicamente mediante variables de entorno.

---

## 🔧 Configuración

Establezca las siguientes variables antes de iniciar la aplicación (PowerShell):

```powershell
$env:DB_USER = 'usuario_valido'
$env:DB_PASSWORD = 'su_contraseña'
```

La aplicación no utiliza otras variables de conexión; host, puerto y nombre de
base son estáticos, por lo que no se pueden cambiar sin modificar el código.

Si necesita crear la base manualmente:

```powershell
psql -U postgres -c "CREATE DATABASE parametrizadas_DB;"
```

---

## 🚀 Instalación y ejecución

```bash
npm install         # instala dependencias
npm start           # arranca el servidor en el puerto 3000
```

Durante el arranque, el modelo ejecuta un `SELECT 1` para comprobar la
conectividad. Si falla, se mostrará un mensaje de error y el proceso terminará.

Al ejecutar con éxito, la aplicación creará la tabla `clientes` si no existe y
sembrará dos registros de ejemplo.

---

## 🌐 Endpoints disponibles

| Método | Ruta                   | Descripción                                               |
|--------|------------------------|-----------------------------------------------------------|
| GET    | `/clientes`            | Lista todos los clientes                                  |
| GET    | `/clientes?rut=...`   | Busca por RUT (0 o 1 registro)                            |
| GET    | `/clientes?edad=n`    | Filtra por edad                                           |
| GET    | `/clientes?nombre=xs` | Filtra por nombre (prefijo)                               |
| DELETE | `/clientes?rut=...`   | Elimina por RUT                                           |
| DELETE | `/clientes?nombre=xs` | Elimina por nombre (requiere único resultado)             |
| DELETE | `/clientes?edad=n`    | Elimina por edad (requiere único resultado)               |
| PUT    | `/clientes/:rut`      | Actualiza el nombre de un cliente                         |
| POST   | `/clientes`           | Crea un nuevo cliente; error 409 si el RUT ya existe      |

Las respuestas tienen formato estandarizado y los códigos HTTP siguen las
recomendaciones del enunciado (200/201/400/404/409/500).

---

## 🧪 Interfaz web

Acceda a `http://localhost:3000/` para obtener un menú con enlaces a:

- `create.html` — formulario para crear cliente
- `update.html` — modificar nombre mediante RUT
- `query.html` — consultas con filtros
- `list.html` — tabla con todos los clientes
- `delete.html` — eliminación por criterio

La apariencia utiliza una paleta moderna/tradicional y está centralizada en
`public/style.css`.

---

## ✅ Pruebas y verificación

Se implementó un script opcional (`npm test`) que recorre los endpoints básicos
y registra los resultados. Aunque se eliminó de la distribución principal, puede
restaurarse copiando `test/runTests.js` si es necesario.

También se proporcionan ejemplos de `curl` en este README para pruebas manuales.

---

## 🛠️ Solución de problemas

- **Error de autenticación**: revise las variables `DB_USER`/`DB_PASSWORD` y los
  permisos del usuario en la base `parametrizadas_DB`.
- **Mensaje durante el arranque**: el módulo `db/index.js` imprime cualquier
  fallo de conexión (`Error al conectar con PostgreSQL: ...`).
- **Servidor arranca pero no interactúa**: asegúrese de que PostgreSQL está en
  ejecución en `localhost:5432` y que la base indicada existe.

---

## 📄 Licencia y notas

El código se entrega como ejemplo didáctico; puede adaptarse libremente para
propósitos de aprendizaje o desarrollo, respetando las dependencias de terceros.
