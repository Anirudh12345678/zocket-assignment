# Zocket – Project Documentation

##  How I Leveraged AI

###  1. Inside the App – AI Task Suggestions

One of the key features is the **AI suggestion engine**. Users can input their current goals or focus areas, and the app generates smart, actionable tasks using the **OpenAI GPT model**. This helps users avoid the mental load of task planning.

Example:
- Input: _"Improve my sleep and productivity"_
- Output: 
  - Set a consistent sleep schedule
  - Avoid screens 1 hour before bed
  - Create a daily task review routine

###  2. During Development – AI-Powered Workflow

AI helped me with:

-  Architect the Go + Next.js stack efficiently  
-  Troubleshoot deployment and Docker setup issues  
- Debug errors like CORS, websocket misconfig, or Go version mismatches  

---

##  Tech Stack

| Layer       | Tech                     |
|-------------|--------------------------|
| Frontend    | Next.js (App Router), Tailwind, shadcn/ui |
| Backend     | Go (Gin), Supabase PostgreSQL |
| Auth        | JWT                       |
| Real-time   | WebSockets (native in Go + browser) |
| AI Engine   | OpenAI (GPT API)         |
| Hosting     | Render (Backend), Vercel (Frontend) |
| Dev Tools   | Docker, GitHub, ChatGPT  |

---

## Learnings

- Deployed a fully functional AI-enhanced product on free tiers  
- Successfully integrated WebSockets with secure authentication  
- Gained deep insights into API structuring and middleware in Gin  
- Developed in public using GitHub + live deployment tools  
