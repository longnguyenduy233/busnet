# 🚌 BusNet — School Bus Management System

**Software Specification**

---

## 1. System Overview

**BusNet** is an internal web-based system for managing school buses and tracking their real-time locations on a map.

### 🎯 Objectives

* Manage buses and routes
* Assign routes to buses
* Track **multiple buses simultaneously**
* Visualize real-time movement (1s updates)
* Ensure high performance and maintainability

---

## 2. High-Level Architecture

### 🧱 Architecture Style

* Backend: **Clean Architecture**
* Frontend: **Angular + NgRx**
* Communication:

  * REST API → CRUD operations
  * SignalR → Real-time GPS updates

```text
[ Angular App ]
       |
       | REST API
       v
[ ASP.NET Core API ]
       |
       | SignalR Hub
       v
[ Real-time GPS Stream ]
       |
       v
[ SQL Server (Docker) ]
```

---

## 3. Technology Stack

### Frontend

* Angular (TypeScript)
* Angular Material
* NgRx (state management)
* Leaflet
* Google Maps tiles (`leaflet.gridlayer.googlemutant`)
* leaflet.motion (movement animation)
* leaflet-polylinedecorator (direction arrows)
* leaflet.markercluster
* SignalR client

### Backend

* .NET 9 (ASP.NET Core Web API)
* SignalR
* Entity Framework Core
* SQL Server (Docker)
* ASP.NET Identity (authentication)

---

## 4. User Flow

### Authentication

* User must login
* Redirect to Home page after login

---

### Home Layout

#### Top Navigation Bar

| Section | Content   |       |          |
| ------- | --------- | ----- | -------- |
| Left    | Logo      |       |          |
| Center  | Bus       | Route | Tracking |
| Right   | User Name |       |          |

---

## 5. Functional Modules

---

## 5.1 Bus Management

### Features

* CRUD bus
* Assign route to bus

### Entity

```ts
Bus {
  id: string
  name: string
  licensePlate: string
  capacity: number
  status: 'Active' | 'Inactive'
  routeId?: string
}
```

---

## 5.2 Route Management

### Features

* CRUD route
* Define route via map (list of points)

### Entity

```ts
Route {
  id: string
  name: string
  points: GeoPoint[]
}
```

```ts
GeoPoint {
  latitude: number
  longitude: number
}
```

---

## 5.3 Tracking Module (Core)

### Features

* Track **multiple buses simultaneously**
* Receive updates every **1 second**
* Animate movement
* Rotate marker based on direction
* Draw movement path (history)
* Display directional arrows

---

## 6. Real-Time System Design

---

### 6.1 Data Flow

```text
[ Simulator ]
     |
     | GPS data (1s)
     v
[ Backend API ]
     |
     v
[ SignalR Hub ]
     |
     | Broadcast
     v
[ Angular Client ]
     |
     v
[ Map Rendering ]
```

---

### 6.2 SignalR Event Contract

#### Event: `ReceiveBusLocation`

```json
{
  "busId": "string",
  "latitude": number,
  "longitude": number,
  "timestamp": "datetime"
}
```

---

### 6.3 Backend Responsibilities

* Receive GPS data from simulator
* Broadcast via SignalR
* Validate bus existence

---

### 6.4 Frontend Responsibilities

* Subscribe to SignalR stream
* Update NgRx store
* Trigger map updates

---

## 7. Frontend Architecture

---

### 7.1 Folder Structure

```text
/app
  /core
  /shared
  /features
    /bus
    /route
    /tracking
  /store
```

---

### 7.2 State Management (NgRx)

```ts
AppState {
  buses: BusState
  routes: RouteState
  tracking: TrackingState
}
```

---

### 7.3 Tracking State (Optimized)

```ts
TrackingState {
  entities: {
    [busId]: {
      currentPosition: GeoPoint
      history: GeoPoint[] // full session trail (append-only, unbounded)
    }
  }
}
```

---

### 7.4 Performance Requirements

#### 📌 Path history retention

* Store **all** GPS points received for each bus during the **current browser session** (append-only in NgRx).
* No fixed cap; memory and polyline complexity grow with session length. If needed later, mitigate with **render-time** simplification (e.g. decimate points for the map only) while keeping full data elsewhere.

---

#### 📌 Change Detection Strategy

All tracking-related components must use:

```ts
changeDetection: ChangeDetectionStrategy.OnPush
```

---

### Why

* Prevent full UI re-render every second
* Improve performance significantly

---

### Additional Rules

* Use immutable updates (NgRx)
* Avoid direct mutation
* Use selectors + async pipe

---

## 8. Map Rendering Strategy

---

### Tools

* Leaflet
* Google tiles via GoogleMutant
* MarkerCluster
* Motion animation
* PolylineDecorator

---

### Rendering Flow

```text
Bus update → NgRx → Component → Update Marker → Animate → Update Path
```

---

### Optimization

* Only update changed buses
* Full history in state; update polylines incrementally per bus
* Cluster markers when needed

---

## 9. Backend Architecture

---

### Layers

```text
API Layer
- Controllers
- SignalR Hub

Core Layer
- Entities
- Interfaces
- Business logic

Infrastructure Layer
- EF Core
- Repositories
- SignalR implementation
```

---

### Project Structure

```text
/src
  /Api
  /Core
  /Infrastructure
```

---

## 10. Database Design

---

### Tables

#### Bus

* Id
* Name
* LicensePlate
* Capacity
* Status
* RouteId (FK)

---

#### Route

* Id
* Name

---

#### RoutePoint

* Id
* RouteId
* Latitude
* Longitude
* Order

---

## 11. API Design

---

### Auth

```http
POST /api/auth/login
```

---

### Bus APIs

```http
GET    /api/buses
GET    /api/buses/{id}
POST   /api/buses
PUT    /api/buses/{id}
DELETE /api/buses/{id}
```

---

### Route Assignment APIs

```http
PUT    /api/buses/{busId}/assign-route
DELETE /api/buses/{busId}/assign-route
```

#### Request

```json
{
  "routeId": "string"
}
```

---

### Route APIs

```http
GET    /api/routes
POST   /api/routes
PUT    /api/routes/{id}
DELETE /api/routes/{id}
```

---

### Tracking (Simulator)

```http
POST /api/tracking/update-location
```

---

## 12. Real-Time Events

---

### Server → Client

* `ReceiveBusLocation`

---

## 13. Docker Setup

---

### SQL Server

```yaml
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: busnet-sql
    environment:
      - SA_PASSWORD=YourStrong!Pass123
      - ACCEPT_EULA=Y
    ports:
      - "1433:1433"
```

---

## 14. Non-Functional Requirements

---

### Performance

* Handle 10 buses with 1s updates
* UI latency < 500ms

---

### Scalability

* Designed for future scaling (100+ buses)
* SignalR supports horizontal scaling

---

### Security

* ASP.NET Identity
* JWT Authentication

---

## 15. Key Design Decisions

---

### SignalR

* Native .NET real-time solution
* Auto reconnect

---

### Leaflet + Google Tiles

* Flexible + high-quality map rendering

---

### NgRx

* Predictable state
* Efficient real-time updates

---

## 16. Risks & Mitigation

| Risk                   | Mitigation           |
| ---------------------- | -------------------- |
| High-frequency updates | Use OnPush + NgRx    |
| Memory growth          | Full client history per bus; watch long sessions; optional future render downsampling |
| UI lag                 | Optimize rendering   |
| WebSocket disconnect   | Auto reconnect       |

---

## 17. Future Enhancements

* Playback history
* Speed calculation
* Alerts (offline, deviation)
* Mobile GPS app
* Multi-user roles
* Cloud deployment
