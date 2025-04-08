Sure! Here's a clean and valid `README.md` you can copy-paste directly into your repo:

---

```markdown
# 🧠 Zocket – AI-Based Task Management System

A productivity-focused, AI-powered task manager with real-time updates using WebSockets.

Built with:

- ⚙️ Go (Gin) Backend
- 💻 Next.js Frontend (App Router)
- 🧠 OpenAI Integration
- 💾 Supabase PostgreSQL
- 🔄 Real-time sync via WebSockets

---

## 📁 Project Structure

```
zocket/
├── backend/       # Golang API server
├── frontend/      # Next.js App frontend
└── README.md
```

---

## 🚀 Getting Started Locally

### ✅ Prerequisites

- Go `v1.23+`
- Node.js `v18+`
- Docker (optional, for DB or deployment)
- Supabase project with a `tasks` table
- OpenAI API key

---

## ⚙️ Backend Setup (`/backend`)

### 1. Install Go dependencies

```bash
cd backend
go mod tidy
```

### 2. Create `.env` file

```bash
cp .env.example .env
```

Fill in the values for:

- `SUPABASE_URL`
- `SUPABASE_KEY`
- `JWT_SECRET`
- `OPENAI_API_KEY`

### 3. Run the server

```bash
go run main.go
```

The server will start on `http://localhost:8080`

---

## 💻 Frontend Setup (`/frontend`)

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Create `.env.local`

```bash
cp .env.local.example .env.local
```

Update:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 3. Run the frontend

```bash
npm run dev
```

The frontend will run at `http://localhost:3000`

---

## 🔄 WebSocket Support

Make sure the backend is running. The frontend uses WebSocket for real-time task updates:

```ts
const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(`${protocol}://localhost:8080/ws/${userId}`);
```

---

## 🧠 AI Features

The app supports AI-generated task suggestions using OpenAI. Use the **"Get AI Suggestions"** button in the UI to generate smart tasks based on your goals.

---

## 🐳 Docker Deployment (optional)

Backend Dockerized example:

```Dockerfile
# backend/Dockerfile

FROM golang:1.23-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
```

---

## 🤝 Contributing

Feel free to fork, clone, and submit a pull request 🚀

---

## 📄 License

MIT
```

---

Let me know if you want me to generate `.env.example` files or Supabase table schema next!
