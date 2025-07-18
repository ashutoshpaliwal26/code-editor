# 🚀 Next.js Cloud Code Editor (Frontend Only)
#### Check for [Backend Repo 📌](https://github.com/ashutoshpaliwal26/code-editor-server)

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge\&logo=next.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-ff69b4?style=for-the-badge)

> A **highly scalable cloud-based code editor** built using **Next.js, Express, Docker, and MongoDB**, where each user gets their **own Ubuntu container** to code in isolation. Future features include **live collaborative editing**, **AI-powered coding suggestions**, and **terminal access**.

---

## ✨ Features

* 🖥️ Real-time code editor (Next.js frontend)
* 🐧 Ubuntu container per user using Docker
* ⚙️ Microservices architecture with Express.js backend
* 🌐 MongoDB for user data and session storage
* 🔐 Secure isolated environments per user
* 🧠 Upcoming: AI autocomplete, live collaboration, and terminal access

---

## 📁 Project Structure

```bash
.
├── .github/
│   ├── workflows/ 
├── app/
│   ├── dashboard/  
│   ├── login/  
│   ├── project/  
│   ├── signup/  
│   ├── globals.css  
│   ├── layout.tsx  
│   └── page.tsx  
├── components/
│   ├── Auth/  
│   ├── CodeEditor/  
│   ├── ui/  
│   └── theam-provider.tsx   
├── context/
│   ├── AuthContext.tsx  
│   ├── EditorContex.tsx  
│   ├── FileSysteContext.tsx  
│   └── TheamContext.tsx
├── hooks/
│   ├── use-mobile.tsx
│   └── user-toast.ts
├── lib/
│   ├── apiClient.ts
│   └── utils.ts
├── provider/
│   ├── SocketProvider.tsx
│   └── StoreProvider.ts
├── public/
├── store/
├── styles/
│   └── globals.css
├── types/
│   └── index.ts
├── .dockerignore
├── .example.env.local
├── .gitignore
├── .components.json
├── .Dockerfile
├── .next.config.mjs
├── .package-lock.json
├── .package.json
├── .pnpm-lock.yaml
├── .postcss.config.mjs
├── .tailwind.config.ts
├── .tsconfig.json
└── README.md
```

---

## 🛠️ Tech Stack

* **Frontend**: Next.js, React, Tailwind CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Containerization**: Docker
* **Dev Tools**: TypeScript, Docker Compose, REST APIs

---

## 🚀 Getting Started

### Prerequisites

* Node.js ≥ 22.x
* Docker & Docker Compose
* MongoDB (Local or Cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nextjs-cloud-code-editor.git
cd nextjs-cloud-code-editor
```

### 2. Setup Environment Variables

Create a `.env.local` file and copy all the env variable from .example.env.local:

```env
# API
NEXT_PUBLIC_API_URL=api_server_url
NEXT_PUBLIC_SOCKET_URL=web_socket_servier_url
```

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

Visit the app at `http://localhost:3000`

---

## 📦 Deployment

* Frontend: Vercel
* Backend: Render  { Backend have other Git Repo }
* Full-stack: Docker

---

## 🧪 Testing (Coming Soon)

* Jest for Unit Testing

---

## 🐳 Docker Highlights

Each user gets:

* 🔒 Secure, sandboxed Ubuntu container
* 📦 Auto-spin containers per session
* 📈 Scalable Docker management with resource limits

---

## 🤝 Contributing

We welcome contributions of all kinds!

### How to Contribute

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request 🙌

### Good First Issues

Check out issues labeled `good first issue` for easy entry points!

---

## 📄 License

Licensed under the MIT License. See `LICENSE` for more.

---

## 👨‍💻 Author

Built with ❤️ by [Ashutosh Paliwal](https://github.com/ashutoshpaliwal26)

---

## 🔮 Coming Soon

* ✍️ Live collaboration
* 🧠 AI autocomplete
* 💻 Web-based terminal
* 🌈 Light/dark theme switcher

✨ Star the repo to stay updated!
