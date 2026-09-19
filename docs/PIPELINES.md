# TravelEase quality pipeline

The **Verify TravelEase** GitHub Actions workflow runs on every pull request,
push to `main`, and manual run from the Actions tab.

```text
Frontend build ─┐
                ├─ Release readiness
Backend quality ┘
```

| Stage | What it verifies |
| --- | --- |
| Frontend build | Dependency installation, linting, and the production Vite build. |
| Backend quality | Python compilation, the Alembic migration graph, and service tests. |
| Release readiness | Whole-repository whitespace checks and the Docker Compose configuration using the non-secret example environment. |

## Viewing a run

Open the repository on GitHub, select **Actions**, then select **Verify
TravelEase**. The graph shows each stage and its logs. Use **Run workflow** to
start the same checks manually.

## Running the main checks locally

```powershell
cd frontend
npm run lint
npm run build
```

```powershell
cd backend
..\venv\Scripts\python.exe -m compileall -q app
..\venv\Scripts\alembic.exe heads
..\venv\Scripts\python.exe -m unittest discover -s tests -v
```

Docker Compose validation requires Docker Desktop:

```powershell
docker compose config
```
