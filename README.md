# Margarita Clothes 🛍️

Tienda de ropa online (e-commerce) con catálogo público y panel de administración.
Proyecto full-stack desarrollado con **React** en el frontend y **Node.js + Express + Prisma + MySQL** en el backend.

> La ropa se organiza por público: **Dama**, **Adolescente**, **Niña** y **Beba**.

---

## ✨ Funcionalidades

**Para clientes (público)**
- Catálogo de productos con búsqueda y filtrado por categoría/público.
- Detalle de cada producto.
- Carrito de compras.
- Registro e inicio de sesión.
- Checkout y creación de pedidos.

**Para el personal (Empleado / Admin)**
- Panel de administración con gestión de productos (crear, editar, eliminar).
- Carga de imágenes de productos.
- Gestión de pedidos y cambio de estado (pendiente, pagado, enviado, entregado, etc.).
- Gestión de usuarios del staff (solo Admin).
- Registro de actividad (activity log).

**Roles de usuario:** `CLIENTE`, `EMPLEADO`, `ADMIN`.

---

## 🧰 Tecnologías

| Capa        | Herramientas                                                        |
|-------------|---------------------------------------------------------------------|
| Frontend    | React 19, Vite, React Router                                        |
| Backend     | Node.js, Express 5                                                   |
| Base de datos | MySQL + Prisma ORM                                                 |
| Autenticación | JWT (JSON Web Tokens) + bcrypt                                     |
| Subida de archivos | Multer                                                       |

---

## 📁 Estructura del proyecto

```
Margarita_Clothes/
├── Backend/            # API REST (Express + Prisma)
│   ├── prisma/         # Esquema, migraciones y seeds
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js    # Punto de entrada del servidor
│   └── uploads/        # Imágenes de productos subidas
└── Frontend/           # Aplicación React (Vite)
    └── src/
        ├── pages/      # Páginas (Home, Cart, Checkout, Login, admin, ...)
        ├── components/ # Componentes reutilizables
        ├── context/    # Auth y carrito (React Context)
        ├── hooks/
        └── api/        # Cliente HTTP hacia el backend
```

---

## 🚀 Cómo ejecutarlo localmente

### Requisitos previos
- **Node.js** (v18 o superior)
- **MySQL** corriendo localmente

### 1) Backend

```bash
cd Backend
npm install
```

Creá un archivo `Backend/.env` con estas variables:

```env
DATABASE_URL="mysql://USUARIO:CONTRASEÑA@localhost:3306/margarita_clothes"
PORT=4000
JWT_SECRET="pon_aqui_una_clave_secreta_larga"
```

> ⚠️ Ajustá usuario, contraseña y **puerto** de MySQL según tu instalación.

Creá la base de datos, aplicá las migraciones y cargá datos de ejemplo:

```bash
npx prisma migrate deploy   # crea las tablas
npm run seed                # carga 15 productos de ejemplo
node prisma/seedDemoUser.js # crea un usuario demo (admin)
```

Iniciá el servidor:

```bash
npm run dev                 # queda escuchando en http://localhost:4000
```

### 2) Frontend

En otra terminal:

```bash
cd Frontend
npm install
```

Creá un archivo `Frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

Iniciá la app:

```bash
npm run dev                 # abre http://localhost:5173
```

---

## 👤 Usuario de demostración

Para probar el panel de administración sin registrarte:

| Email                  | Contraseña | Rol   |
|------------------------|------------|-------|
| `demo@margarita.com`   | `Demo1234` | Admin |

> Se crea/restaura ejecutando `node prisma/seedDemoUser.js` desde la carpeta `Backend`.

---

## 🔌 Endpoints principales de la API

Base: `http://localhost:4000/api`

| Método | Ruta                      | Acceso            | Descripción                        |
|--------|---------------------------|-------------------|------------------------------------|
| POST   | `/auth/register`          | Público           | Registrar un cliente               |
| POST   | `/auth/login`             | Público           | Iniciar sesión (devuelve token)    |
| GET    | `/products`               | Público           | Listar productos del catálogo      |
| GET    | `/products/:id`           | Público           | Ver un producto                    |
| GET    | `/products/admin/all`     | Empleado / Admin  | Listar todos (incl. eliminados)    |
| POST   | `/products`               | Empleado / Admin  | Crear producto                     |
| PUT    | `/products/:id`           | Empleado / Admin  | Editar producto                    |
| DELETE | `/products/:id`           | Empleado / Admin  | Eliminar producto                  |
| POST   | `/orders`                 | Autenticado       | Crear pedido                       |
| GET    | `/orders/me`              | Autenticado       | Mis pedidos                        |
| GET    | `/orders`                 | Empleado / Admin  | Listar todos los pedidos           |
| PUT    | `/orders/:id/status`      | Empleado / Admin  | Cambiar estado de un pedido        |
| GET    | `/users`                  | Admin             | Listar personal                    |
| POST   | `/uploads`                | Empleado / Admin  | Subir imagen de producto           |

---

## 📜 Scripts útiles

**Backend**
- `npm run dev` — servidor con recarga automática (nodemon)
- `npm start` — servidor en modo producción
- `npm run seed` — carga productos de ejemplo
- `node prisma/seedDemoUser.js` — crea/restaura el usuario demo

**Frontend**
- `npm run dev` — entorno de desarrollo
- `npm run build` — build de producción
- `npm run preview` — previsualizar el build

---

Proyecto desarrollado por **Luciana** · Margarita Clothes
