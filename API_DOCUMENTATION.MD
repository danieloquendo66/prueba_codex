# API Documentation

## Base URL
- `{{base_url}}` (e.g., `http://localhost:3000`)

---
## Authentication

### Register
- **Method:** POST
- **Endpoint:** `/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "telefono": "+34123456789",
    "foto": "http://...",  // opcional
    "ssn": "123-45-6789",
    "password": "secret123"
  }
  ```
- **Responses:**
  - `201 Created`:
    ```json
    {
      "id": "uuid",
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@example.com",
      "telefono": "+34123456789",
      "foto": "http://...",
      "ssn": "123-45-6789",
      "role": "USER",
      "createdAt": "2025-06-15T...",
      "updatedAt": "2025-06-15T...",
      "deletedAt": null,
      "phoneVerified": false,
      "phoneVerificationCode": null,
      "phoneVerificationCodeExpiresAt": null
    }
    ```
  - `409 Conflict`:
    ```json
    { "statusCode": 409, "message": "Email already exists" }
    ```
  - `400 Bad Request`: Validación fallida
  - `500 Internal Server Error`

### Login
- **Method:** POST
- **Endpoint:** `/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "juan.perez@example.com",
    "password": "secret123"
  }
  ```
- **Responses:**
  - `200 OK`:
    ```json
    { "access_token": "jwt.token.here" }
    ```
  - `401 Unauthorized`
  - `500 Internal Server Error`

### Google OAuth

#### Iniciar flujo
- **Method:** GET
- **Endpoint:** `/auth/google`
- **Descripción:** Redirige a Google para autenticación.

#### Callback
- **Method:** GET
- **Endpoint:** `/auth/google/redirect`
- **Responses:**
  - `200 OK`:
    ```json
    { "access_token": "jwt.token.here" }
    ```
  - `401 Unauthorized`
  - `500 Internal Server Error`

---
## Usuarios (Requiere rol ADMIN)
Todos los endpoints deben incluir header:
```
Authorization: Bearer {{jwt_token}}
```

### Crear usuario
- **Method:** POST
- **Endpoint:** `/users`
- **Headers:** `Content-Type: application/json`, `Authorization`
- **Body:** Igual a Register
- **Responses:**
  - `201 Created`: Usuario creado
  - `409 Conflict`: Clave única duplicada
  - `400 Bad Request`: Validación fallida
  - `500 Internal Server Error`

### Listar usuarios
- **Method:** GET
- **Endpoint:** `/users`
- **Query Params (opcionales):**
  - `email`, `telefono`, `ssn`, `nombre`, `apellido`
- **Responses:**
  - `200 OK`: Array de usuarios
  - `500 Internal Server Error`

### Obtener usuario por ID
- **Method:** GET
- **Endpoint:** `/users/:id`
- **Params:** `id` (UUID)
- **Responses:**
  - `200 OK`: Usuario
  - `404 Not Found`
  - `500 Internal Server Error`

### Actualizar usuario
- **Method:** PATCH
- **Endpoint:** `/users/:id`
- **Headers:** `Content-Type: application/json`, `Authorization`
- **Body:** Campos opcionales a actualizar
- **Responses:**
  - `200 OK`: Usuario actualizado
  - `409 Conflict`: Clave duplicada
  - `404 Not Found`
  - `400 Bad Request`
  - `500 Internal Server Error`

### Eliminar usuario
- **Method:** DELETE
- **Endpoint:** `/users/:id`
- **Responses:**
  - `200 OK` o `204 No Content`
  - `404 Not Found`
  - `500 Internal Server Error`

### Enviar código de verificación SMS
- **Method:** POST
- **Endpoint:** `/users/:id/phone/send-code`
- **Responses:**
  - `200 OK`: `{ "message": "Verification code sent" }`
  - `403 Forbidden`: No autorizado
  - `404 Not Found`
  - `500 Internal Server Error`

### Verificar código SMS
- **Method:** POST
- **Endpoint:** `/users/:id/phone/verify-code`
- **Headers:** `Content-Type: application/json`, `Authorization`
- **Body:**
  ```json
  { "code": "12345" }
  ```
- **Responses:**
-  - `200 OK`: `{ "message": "Phone number verified" }`
-  - `401 Unauthorized`: Código inválido o expirado
-  - `403 Forbidden`
-  - `500 Internal Server Error`
 
---
## Configuración de Servicios (Requiere rol ADMIN)
Todos los endpoints deben incluir header:
```
Authorization: Bearer {{jwt_token}}
```

### Categorías de Servicios
- POST `/service-categories`: recibe `name: string`, `description?: string`. Respuestas: `201 Created`, `400 Bad Request`, `500 Internal Server Error`.
- GET `/service-categories`: lista todas. Respuestas: `200 OK`, `500 Internal Server Error`.
- GET `/service-categories/:id`: obtiene una categoría. Respuestas: `200 OK`, `404 Not Found`, `500 Internal Server Error`.
- PATCH `/service-categories/:id`: recibe `name`, `description`. Respuestas: `200 OK`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`.
- DELETE `/service-categories/:id`: elimina. Respuestas: `200 OK` / `204 No Content`, `404 Not Found`, `500 Internal Server Error`.

### Servicios
- POST `/services`: recibe `name: string`, `description?: string`, `categoryId: UUID`, `basePrice: number`. Respuestas: `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`.
- GET `/services`: lista todos con categorías y opciones. Respuestas: `200 OK`, `500 Internal Server Error`.
- GET `/services/:id`: obtiene un servicio. Respuestas: `200 OK`, `404 Not Found`, `500 Internal Server Error`.
- PATCH `/services/:id`: recibe campos opcionales. Respuestas: `200 OK`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`.
- DELETE `/services/:id`: elimina. Respuestas: `200 OK` / `204 No Content`, `404 Not Found`, `500 Internal Server Error`.

### Opciones de Servicio
- POST `/service-options`: recibe `name: string`, `description?: string`, `serviceId: UUID`, `extraPrice: number`. Respuestas: `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`.
- GET `/service-options`: lista todas con servicio. Respuestas: `200 OK`, `500 Internal Server Error`.
- GET `/service-options/:id`: obtiene una opción. Respuestas: `200 OK`, `404 Not Found`, `500 Internal Server Error`.
- PATCH `/service-options/:id`: recibe campos opcionales. Respuestas: `200 OK`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`.
- DELETE `/service-options/:id`: elimina. Respuestas: `200 OK` / `204 No Content`, `404 Not Found`, `500 Internal Server Error`.

---
## Pricing
POST `/pricing/calculate`: recibe `serviceId: UUID`, `area: number`, `optionIds?: UUID[]`, `region?: string`. Respuestas: `200 OK` (detalle de precios), `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`.

---
## Projects (Clientes)
Todos los endpoints requieren token Bearer (`Authorization: Bearer {{jwt_token}}`).

### Crear Proyecto
- **Method:** POST
- **Endpoint:** `/projects`
- **Body:**
  ```json
  {
    "items": [
      { "serviceId": "uuid-servicio", "area": 100, "optionIds": ["uuid-op1"] },
      { "serviceId": "uuid-servicio2", "area": 50 }
    ]
  }
  ```
- **Responses:**
  - `201 Created`: Proyecto completo con items y totalPrice.
  - `400 Bad Request`: Validación fallida.
  - `500 Internal Server Error`.

---
## Payments
Todos los endpoints de pagos son públicos. El webhook requiere la cabecera `stripe-signature`.

### Crear Payment Intent
- **Method:** POST
- **Endpoint:** `/payments/create-intent`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "projectId": "uuid-del-proyecto",
    "amount": 100.50,
    "currency": "usd"
  }
  ```
- **Responses:**
  - `201 Created`: `{ "clientSecret": "string", "paymentId": "uuid" }`
  - `400 Bad Request`
  - `500 Internal Server Error`

### Webhook de Stripe
- **Method:** POST
- **Endpoint:** `/payments/webhook`
- **Headers:**
  - `Content-Type: application/json`
  - `stripe-signature: {{stripe_signature}}`
- **Body:** Raw JSON del evento de Stripe.
- **Responses:**
  - `200 OK`: `{ "received": true }`
  - `4xx/5xx`

### Listar Pagos por Proyecto
- **Method:** GET
- **Endpoint:** `/payments/project/:projectId`
- **Responses:**
  - `200 OK`: Array de pagos.
  - `500 Internal Server Error`

### Contracts
Todos los endpoints de contratos requieren header:
```
Authorization: Bearer {{jwt_token}}
```

#### Generar Contrato
- **Method:** POST
- **Endpoint:** `/contracts`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  { "projectId": "uuid-del-proyecto" }
  ```
- **Responses:**
  - `201 Created`: `{ "id": "uuid", "htmlContent": "<html>..." }`
  - `400 Bad Request`
  - `500 Internal Server Error`

#### Obtener Contrato
- **Method:** GET
- **Endpoint:** `/contracts/:id`
- **Responses:**
  - `200 OK`: Contrato completo con campos `id`, `projectId`, `htmlContent`, `signature`, `status`, `createdAt`, `updatedAt`
  - `404 Not Found`

#### Firmar Contrato
- **Method:** POST
- **Endpoint:** `/contracts/:id/sign`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  { "signature": "base64-o-url-o-texto" }
  ```
- **Responses:**
  - `200 OK`: Contrato con firma registrada y estado actualizado
  - `404 Not Found`
  - `400 Bad Request`

#### Enviar Contrato para Firma
- **Method:** POST
- **Endpoint:** `/contracts/:id/send`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{jwt_token}}`
- **Body:**
  ```json
  {
    "recipientName": "Juan Pérez",
    "recipientEmail": "juan.perez@example.com",
    "returnUrl": "http://localhost:3000/return"
  }
  ```
- **Responses:**
  - `200 OK`: `{ "signingUrl": "https://app.docusign.net/Signing/Sign..." }`
  - `404 Not Found`
  - `400 Bad Request`

### Listar Proyectos del Usuario
- **Method:** GET
- **Endpoint:** `/projects`
- **Responses:**
  - `200 OK`: Array de proyectos.
  - `500 Internal Server Error`.

### Obtener Proyecto por ID
- **Method:** GET
- **Endpoint:** `/projects/:id`
- **Responses:**
  - `200 OK`: Proyecto.
  - `404 Not Found`: No existe o no pertenece al usuario.
  - `500 Internal Server Error`.

### Actualizar Estado de Proyecto
- **Method:** PATCH
- **Endpoint:** `/projects/:id/status`
- **Body:**
  ```json
  { "status": "APPROVED" }
  ```
- **Responses:**
  - `200 OK`: Proyecto con nuevo estado.
  - `400 Bad Request`: Estado inválido.
  - `403 Forbidden`: Proyecto no pertenece al usuario.
  - `404 Not Found`: Proyecto no existe.
  - `500 Internal Server Error`.

---
## Scheduling
Todos los endpoints requieren header:
```
Authorization: Bearer {{jwt_token}}
```

### CRUD Teams (ADMIN)
- POST `/teams`: crea equipo. Body `{ name: string, capacity: number }`.
- GET `/teams`: lista equipos.
- GET `/teams/:id`: obtiene equipo.
- PATCH `/teams/:id`: actualiza equipo.
- DELETE `/teams/:id`: elimina equipo.

### Disponibilidad
- GET `/scheduling/availability?date=YYYY-MM-DD`: devuelve franjas ocupadas por equipo.

### Agendar Proyecto
- POST `/scheduling/schedule`
  ```json
  { "projectId": "uuid", "teamId": "uuid", "startTime": ISO8601, "endTime": ISO8601 }
  ```
  - `201 Created`: Log generado.
  - `409 Conflict`: No hay capacidad.
  - `400 Bad Request`.
  - `500 Internal Server Error`.

### Reprogramar
- PATCH `/scheduling/schedule/:id/reschedule`
  Body `{ startTime: ISO8601, endTime: ISO8601 }`.

### Cancelar Cita
- DELETE `/scheduling/schedule/:id`.
  - `200 OK` o `204 No Content`.
  - `404 Not Found`.
  - `500 Internal Server Error`.

---
## Field Operations
Todos los endpoints requieren header:
```
Authorization: Bearer {{jwt_token}}
```

### Subir Foto del Proyecto
- **Method:** POST
- **Endpoint:** `/field-ops/photos`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{jwt_token}}`
- **Body:**
  ```json
  {
    "projectId": "uuid-del-proyecto",
    "url": "https://.../foto.jpg",
    "description": "Foto del avance del proyecto"
  }
  ```
- **Responses:**
  - `201 Created`: objeto ProjectPhoto.
  - `400 Bad Request`.
  - `500 Internal Server Error`.

### Listar Fotos del Proyecto
- **Method:** GET
- **Endpoint:** `/field-ops/photos/:projectId`
- **Headers:** `Authorization: Bearer {{jwt_token}}`
- **Responses:**
  - `200 OK`: Array de fotos.
  - `500 Internal Server Error`.