# BusNet

End-to-end demo for **fleet operations**: manage **buses** and **planned routes**, assign routes to buses, and **track live GPS** on a map with **SignalR** updates. Includes a **Node/TypeScript simulator** so you can drive location updates without hardware.

---

## Monorepo layout

| Directory | Description |
|-----------|-------------|
| **`backend/`** | ASP.NET Core **.NET 10** API, EF Core, SQL Server, JWT (access + refresh), SignalR `TrackingHub`, Identity seed user. |
| **`frontend/`** | **Angular 21** SPA (standalone, Material, NgRx), Leaflet map, Playwright **e2e**. |
| **`simulator/`** | GPS simulator (`ts-node`), Vitest tests. |
| **`docs/`** | Specification, presentation notes, one-pager outline. |

---

## Tech stack (summary)

- **Backend:** ASP.NET Core, Entity Framework Core, SQL Server, ASP.NET Identity (Core), JWT Bearer + refresh rotation, SignalR.
- **Frontend:** Angular 21, NgRx (store / effects / devtools), Angular Material, RxJS, Leaflet (+ optional Google/OSM basemap via `environment`).
- **Tests:** xUnit (backend), Vitest (frontend & simulator), Playwright (frontend e2e). GitHub Actions can run **e2e** (see `.github/workflows/frontend-e2e.yml`).

---

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (matching **net10.0** in `BusNet.Api.csproj`)
- [Node.js](https://nodejs.org/) + npm (package manager pins in `package.json` where present)
- **SQL Server** reachable from the connection string in **`backend/src/BusNet.Api/appsettings.json`** (adjust user/password/host as needed)

---

## Quick start (local)

### 1. Run the API

From the repository root:

```bash
dotnet run --project backend/src/BusNet.Api/BusNet.Api.csproj
```

- URLs are defined in **`backend/src/BusNet.Api/Properties/launchSettings.json`** (default **HTTP** profile: `http://localhost:5000`).
- On **macOS**, something else may already use port **5000** (e.g. AirPlay). Either free the port or change `applicationUrl` in `launchSettings.json` and match the SPA (step 2).
- First run applies EF migrations and may seed a **demo admin** if no users exist (see `Program.cs` `SeedAsync`). Use **strong secrets and passwords** outside local demos.

### 2. Run the SPA

```bash
cd frontend
npm install
npm start
```

Open **`http://localhost:4200/`**.

Align **`frontend/src/environments/environment.ts`** with the API:

- **`apiUrl`**: `http://<host>:<port>/api`
- **`hubUrl`**: `http://<host>:<port>/hubs` (SignalR base; the app appends `/tracking` where needed)

Use **`environment.prod.ts`** for production builds (`ng build`).

### 3. (Optional) GPS simulator

```bash
cd simulator
npm install
npm start
```

Override the API base if needed:

```bash
API_URL=http://localhost:5000/api npm start
```

---

## Configuration highlights

| Area | Where |
|------|--------|
| **Database** | `backend/src/BusNet.Api/appsettings.json` → `ConnectionStrings:DefaultConnection` |
| **JWT signing & lifetimes** | `Jwt` section in the same file (`Key`, `Issuer`, `Audience`, token expiry settings) |
| **CORS** | `Cors:Origins` in `appsettings.json`; Development can allow browser **loopback** on any port (see `Program.cs`) |
| **Maps** | `frontend/src/environments/environment.ts` → optional `googleMapsApiKey` (if empty, the app falls back to OSM tiles). **Do not commit production API keys** to public repositories. |

---

## Testing

```bash
# Backend
cd backend && dotnet test

# Frontend (Vitest via Angular CLI)
cd frontend && npm test

# Simulator
cd simulator && npm test

# E2E (from frontend; needs browsers installed per Playwright)
cd frontend && npm run e2e:ci
```

---

## Documentation

- **[`docs/specification.md`](docs/specification.md)** — requirements / behavior details  
- **[`docs/PRESENTATION.md`](docs/PRESENTATION.md)** — stakeholder-style overview and diagram  
- **[`docs/PRESENTATION-ONEPAGE.md`](docs/PRESENTATION-ONEPAGE.md)** — one-page printable outline  

The Angular CLI–generated notes under **`frontend/README.md`** still apply to the SPA subproject (`ng serve`, `ng test`, etc.).

---

## Security note

This project is intended for **development and demos**. Before any real deployment: rotate **Jwt:Key**, tighten Identity password rules, use **HTTPS**, lock down **CORS**, and keep secrets out of git (use **User Secrets**, environment variables, or a secret store).

---

## License

If no `LICENSE` file is present in the repository, all rights are reserved unless you add one.
