# ⚔️ Judgex – Code. Compete. Conquer.

**Judgex** is a full-featured online coding judge and contest management platform built for developers, educators, and competitive programmers. It supports real-time code execution, problem-solving, contests, detailed analytics, and AI-powered guidance — all within a secure, scalable infrastructure.

---

##  Features

###  Authentication & Security

- Secure registration and login with **JWT**  
- Passwords hashed using **bcrypt**  
- **CORS-protected** API with domain-restricted access  

###  Problem & Contest Management

- Create and manage contests with scheduled timings (**Admin only**)  
- Reusable problem sets with **difficulty tagging**  
- Admin dashboard to control **problem order and visibility**  

###  Real-Time Code Execution

- **Docker-based** isolated compiler service  
- Multi-language support (**C++, Python, JavaScript**, etc.)  
- Instant feedback for **test case results**  

###  AI-Assisted Submissions

- **Gemini-powered hints** for first wrong submissions  
- Encourages learning without giving away direct solutions  
- Simplifies **complex problem statements** to aid understanding  

###  User Dashboard & Analytics

- View **submission history** with verdicts and timestamps  
- **Line charts** to visualize coding activity over time  
- Track **profile stats**: problems solved, contests participated, ranks, etc.  

###  Deployment & DevOps

- Dockerized backend hosted on **AWS EC2**  
- Dockerized compiler hosted on **AWS EC2**   
- Frontend deployed using **Vercel**  
- **SSL** enabled via Let’s Encrypt and **Certbot**  
- Subdomain routing with **NGINX reverse proxy**  

---

##  Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB   
- **AI Integration:** Gemini  

---

## 📍 Live Demo

👉 [https://judgex.space](https://judgex.space)
