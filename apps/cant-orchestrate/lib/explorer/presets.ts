import type { Preset } from "./types";

export const PRESETS: Preset[] = [
  {
    id: "node-basic",
    label: "Node.js (basic)",
    dockerfile: `FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD npm start`,
  },
  {
    id: "node-multistage",
    label: "Node.js (multi-stage)",
    dockerfile: `FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production

FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER 1000
CMD ["dist/server.js"]`,
  },
  {
    id: "python-poetry",
    label: "Python + Poetry",
    dockerfile: `FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

FROM base AS deps
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt -o requirements.txt
RUN pip install -r requirements.txt

FROM base
COPY --from=deps /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY . .
USER nobody
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0"]`,
  },
  {
    id: "go-scratch",
    label: "Go (scratch)",
    dockerfile: `FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /app/server ./cmd/server

FROM scratch
COPY --from=build /app/server /server
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
USER 65534
EXPOSE 8080
ENTRYPOINT ["/server"]`,
  },
];
