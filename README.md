# Sistema de Inventario para Tienda

Proyecto académico — **Programación de Aplicaciones Web**. Sistema de gestión de inventario con **arquitectura por capas**, backend en **Spring Boot** (API REST en JSON) y frontend en **Angular**.

## 🏗️ Arquitectura del sistema

```
[ Frontend Angular (components / services / models) ]
                      ↕  HTTP (JSON)
   [ Controller (@RestController) ]
                      ↕
   [ Service (interfaz + implementación) ]
                      ↕
   [ Repository (Spring Data JPA) ]
                      ↕
       [ Entity (JPA) ] ↔ [ Base de datos MySQL ]
```

Todo el registro y edición de datos se hace **por JSON** (peticiones HTTP con `Content-Type: application/json`), no por formularios tradicionales ni acceso directo a la base de datos.

## 📁 Estructura de carpetas

```
SistemaInventarioTienda/
├── backend/                     Proyecto Spring Boot (Maven)
│   └── src/main/java/com/pontificia/inventario/
│       ├── entity/              12 entidades JPA (una por tabla)
│       ├── repository/          Interfaces JpaRepository
│       ├── service/             Interfaces de lógica de negocio
│       ├── service/impl/        Implementación de cada service
│       ├── controller/api/      Controladores REST (JSON)
│       ├── dto/                 (reservado para DTOs de reportes)
│       └── config/               Configuración (CORS, etc.)
├── database/
│   └── schema_inventario.sql    Script MySQL: 12 tablas + datos de prueba
└── frontend/                    Proyecto Angular
    └── src/app/
        ├── components/          Componentes (ejemplo completo: productos/)
        ├── models/               Interfaces TypeScript (una por entidad)
        └── services/             Servicios HttpClient (uno por entidad)
```

## 🗄️ Modelo de datos (12 tablas)

| Tabla | Descripción |
|---|---|
| `rol` | Catálogo de roles del sistema |
| `usuario` | Usuarios que operan el sistema |
| `categoria_producto` | Categorías de productos |
| `proveedor` | Proveedores de mercadería |
| `almacen` | Puntos de almacenamiento físico |
| `producto` | Productos del inventario (stock, precios) |
| `cliente` | Clientes que realizan compras |
| `compra` | Cabecera de compras a proveedores |
| `detalle_compra` | Detalle de productos por compra (N:M) |
| `venta` | Cabecera de ventas a clientes |
| `detalle_venta` | Detalle de productos por venta (N:M) |
| `movimiento_inventario` | Kardex: entradas/salidas de stock |

Relaciones 1:N (`Usuario → Compra`, `Proveedor → Producto`, etc.) y N:M resueltas con tablas intermedias (`detalle_compra`, `detalle_venta`), igual que en un sistema de inventario real.

## 🔐 Login

El sistema tiene una pantalla de login (`/login`) que valida contra la tabla `usuario` (endpoint `POST /api/auth/login`). Mientras no haya sesión iniciada, no se puede entrar al dashboard (`/dashboard`) — lo protege un *guard* de Angular.

Usuario de prueba (ya viene en `schema_inventario.sql`):
- **Usuario:** `admin`
- **Contraseña:** `admin123`

## ⚙️ Cómo ejecutar el proyecto (un solo comando)

Ya no hace falta abrir dos terminales (backend + `ng serve`). El `pom.xml` del backend compila el frontend Angular automáticamente y lo deja sirviéndose desde el mismo Spring Boot, en el mismo puerto.

1. Crea la base de datos ejecutando `database/schema_inventario.sql` en MySQL (o deja que Spring Boot la cree sola, ya tiene `createDatabaseIfNotExist=true`).
2. Revisa `backend/src/main/resources/application.properties` y ajusta usuario/contraseña de MySQL si no usas `root/root`.
3. Desde la carpeta `backend/`, ejecuta un único comando:
   ```
   mvnw clean package spring-boot:run        (Windows: mvnw.cmd clean package spring-boot:run)
   ```
   La primera vez tarda más: Maven descarga Node/npm por su cuenta y corre `npm install` + `ng build`. Necesitas internet solo para ese primer build. Las siguientes veces es más rápido.
4. Abre **`http://localhost:8080`** en el navegador. Ahí sale directo la pantalla de **login**, y ya no `http://localhost:4200`.

> Si por algo necesitas volver al modo de desarrollo (backend en 8080 + `ng serve` en 4200 con recarga en caliente), sigue funcionando igual: corre `mvnw spring-boot:run` en `backend/` y, aparte, `npm install` + `ng serve` en `frontend/`. El `CorsConfig` del backend ya permite peticiones desde `http://localhost:4200`.
>
> Para saltarte la compilación del frontend en un build de Maven (por ejemplo si solo tocaste algo del backend), agrega `-Dskip.frontend.build=true` al comando.

## 🔗 Endpoints REST disponibles (por cada una de las 12 entidades)

Todos siguen el mismo patrón, por ejemplo para productos:

| Método | Endpoint | Acción |
|---|---|---|
| GET | `/api/productos` | Listar todos |
| GET | `/api/productos/{id}` | Buscar por ID |
| POST | `/api/productos` | Crear (body JSON) |
| PUT | `/api/productos/{id}` | Actualizar (body JSON) |
| DELETE | `/api/productos/{id}` | Eliminar |

Endpoints adicionales con lógica de negocio propia:
- `GET /api/productos/stock-bajo` → productos cuyo stock llegó o bajó del mínimo.
- `PATCH /api/productos/{id}/ajustar-stock?cantidad=10&esEntrada=true` → ajusta el stock (usado por compras/ventas/movimientos).

## 🧭 Navegación del dashboard

El `dashboard` ya no muestra solo Productos: tiene un menú lateral con las 12 secciones (Productos, Categorías, Proveedores, Almacenes, Clientes, Compras, Detalle de Compras, Ventas, Detalle de Ventas, Movimientos, Usuarios, Roles). Cada una es un componente CRUD completo (crear, editar, eliminar, listar) contra su endpoint REST correspondiente — todos siguen el mismo patrón que `productos`.

## 📌 Cómo continuar el proyecto

Todos los componentes (en `frontend/src/app/components/`) ya están generados y funcionales. Si quieres personalizar alguno (agregar una columna, cambiar validaciones, mejorar el diseño), edita su `*.component.ts` / `*.component.html` — todos siguen la misma estructura que `productos.component.ts`.
