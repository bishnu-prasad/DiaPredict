
🧠 DiaPredict — AI-Powered Diabetes Risk Prediction

DiaPredict is a full-stack AI application that predicts diabetes risk using machine learning and an interactive chat-based interface. It provides users with real-time health insights in a clean, modern UI inspired by clinical tools.

⸻

🚀 Features
	•	🤖 AI Chat-Based Assessment
	•	📊 Real-Time Diabetes Risk Prediction
	•	⚡ FastAPI Backend with ML Model
	•	🎨 Modern Next.js Frontend (Apple-style UI)
	•	💾 Persistent Chat (localStorage)
	•	✅ Strict Input Validation (clinical ranges)

⸻

🛠️ Tech Stack

Frontend
	•	Next.js (App Router)
	•	React + TypeScript
	•	Tailwind CSS
	•	Framer Motion

Backend
	•	FastAPI
	•	Python
	•	Pydantic

Machine Learning
	•	Scikit-learn
	•	Logistic Regression Model

⸻

🧩 Project Structure

DiaPredict/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── model/
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── package.json
│
└── .gitignore


⸻

⚙️ How It Works
	1.	User answers health-related questions via chat
	2.	Data is validated on the frontend
	3.	Backend processes input using ML model
	4.	Risk level and probability are returned
	5.	UI displays result with explanation

⸻

📦 Installation & Setup

🔹 Clone Repository

git clone https://github.com/bishnu-prasad/DiaPredict.git
cd DiaPredict


⸻

🔹 Backend Setup

cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend runs on:

http://127.0.0.1:8000


⸻

🔹 Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:3000


⸻

🔐 Input Constraints (Validation)

Parameter	Range
Age	1 – 120
BMI	10 – 60
HbA1c	3 – 15
Glucose	50 – 300


⸻

📊 Output Example

Risk Level: Moderate
Probability: 63%


⸻

⚠️ Disclaimer

This project is for educational and demonstration purposes only.
It is not a substitute for professional medical advice.

⸻

📈 Future Improvements
	•	🔮 AI-based health recommendations
	•	📱 Mobile responsiveness enhancement
	•	🌐 Deployment (Vercel + Render)
	•	📊 Dashboard for analytics
	•	🔐 User authentication

⸻

👨‍💻 Author

Bishnuprasad Tripathy
	•	GitHub: https://github.com/bishnu-prasad

⸻

⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

