import sqlite3
import random
import uuid
import os
from fastapi import FastAPI, Form, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= CREATE UPLOAD FOLDER =================
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

otp_storage = {}

# ================= DATABASE INIT =================
def init_db():
    conn = sqlite3.connect("nagarik_seva.db")
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            contact TEXT UNIQUE,
            aadhaar TEXT UNIQUE,
            password TEXT,
            email TEXT,
            address TEXT,
            gender TEXT
        )
    """)

    # Complaints Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            image_path TEXT,
            status TEXT DEFAULT 'Pending'
        )
    """)

    conn.commit()
    conn.close()

init_db()

# ================= ROOT =================
@app.get("/")
async def root():
    return {"message": "Nagarik Seva Backend Running 🚀"}

# ================= OTP SYSTEM =================
@app.post("/send-otp")
async def send_otp(contact: str = Form(...)):
    otp = str(random.randint(100000, 999999))
    otp_storage[contact] = otp
    print(f"\n🚀 OTP FOR {contact}: {otp} 🚀\n")
    return {"message": "OTP Sent Successfully"}

@app.post("/verify-otp")
async def verify_otp(
    contact: str = Form(...),
    otp: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    email: str = Form(...),
    address: str = Form(...),
    gender: str = Form(...)
):
    if contact in otp_storage and otp_storage[contact] == otp:
        try:
            dummy_id = f"AID-{uuid.uuid4().hex[:6].upper()}"

            conn = sqlite3.connect("nagarik_seva.db")
            cursor = conn.cursor()

            cursor.execute("""
                INSERT INTO users (username, contact, aadhaar, password, email, address, gender)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (username, contact, dummy_id, password, email, address, gender))

            conn.commit()
            conn.close()

            del otp_storage[contact]
            return {"message": "Signup Successful 🎉"}

        except Exception:
            raise HTTPException(status_code=400, detail="User Already Registered")

    raise HTTPException(status_code=400, detail="Invalid OTP")

# ================= LOGIN =================
@app.post("/login")
async def login(contact: str = Form(...), password: str = Form(...)):
    conn = sqlite3.connect("nagarik_seva.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT username FROM users WHERE contact=? AND password=?",
        (contact, password)
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        return {"message": "Login Successful", "username": user[0]}
    else:
        raise HTTPException(status_code=401, detail="Invalid Mobile or Password")

# ================= REGISTER COMPLAINT =================
@app.post("/complaints")
async def register_complaint(
    title: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(None)
):
    image_path = None

    if file:
        unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_location = f"uploads/{unique_filename}"

        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())

        image_path = file_location

    conn = sqlite3.connect("nagarik_seva.db")
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO complaints (title, description, image_path) VALUES (?, ?, ?)",
        (title, description, image_path)
    )

    conn.commit()
    conn.close()

    return {"message": "Complaint Submitted Successfully ✅"}

# ================= ADMIN DASHBOARD =================
@app.get("/admin/complaints")
async def get_all_complaints():
    conn = sqlite3.connect("nagarik_seva.db")
    cursor = conn.cursor()

    cursor.execute("SELECT id, title, description, image_path, status FROM complaints")
    rows = cursor.fetchall()
    conn.close()

    complaints = []
    for row in rows:
        complaints.append({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "image_path": row[3],
            "status": row[4]
        })

    return complaints

# ================= MARK AS SOLVED =================
@app.put("/admin/update-status/{complaint_id}")
async def update_status(complaint_id: int):
    conn = sqlite3.connect("nagarik_seva.db")
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE complaints SET status='Solved' WHERE id=?",
        (complaint_id,)
    )

    conn.commit()
    conn.close()

    return {"message": "Complaint Marked as Solved ✅"}

# ================= ANALYTICS =================
@app.get("/admin/analytics")
async def get_analytics():
    conn = sqlite3.connect("nagarik_seva.db")
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM complaints")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE status='Pending'")
    pending = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM complaints WHERE status='Solved'")
    solved = cursor.fetchone()[0]

    conn.close()

    return {
        "total_complaints": total, 
        "pending_complaints": pending,
        "solved_complaints": solved
    }