"""
database.py
-----------
SQLite database for vitals storage.
"""

import aiosqlite
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "sehat.db")


async def init_db():
    """Create tables if they don't exist."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS vitals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                heart_rate INTEGER,
                bp_systolic INTEGER,
                bp_diastolic INTEGER,
                temperature REAL,
                weight REAL,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()
    print("✅ [DB] Database initialized")


async def save_vitals(session_id: str, data: dict) -> dict:
    """Save a vitals reading. Returns the saved record."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            INSERT INTO vitals (session_id, heart_rate, bp_systolic, bp_diastolic, temperature, weight)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            session_id,
            data.get("heart_rate"),
            data.get("bp_systolic"),
            data.get("bp_diastolic"),
            data.get("temperature"),
            data.get("weight")
        ))
        await db.commit()
        
        # Get the inserted record
        cursor = await db.execute("SELECT * FROM vitals WHERE id = last_insert_rowid()")
        row = await cursor.fetchone()
        return _row_to_dict(row)


async def get_vitals(session_id: str, limit: int = 30) -> list[dict]:
    """Get last N vitals records for a session."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT * FROM vitals WHERE session_id = ? ORDER BY recorded_at DESC LIMIT ?",
            (session_id, limit)
        )
        rows = await cursor.fetchall()
        return [_row_to_dict(r) for r in reversed(rows)]


async def get_latest_vitals(session_id: str) -> dict | None:
    """Get the most recent vitals record."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT * FROM vitals WHERE session_id = ? ORDER BY recorded_at DESC LIMIT 1",
            (session_id,)
        )
        row = await cursor.fetchone()
        return _row_to_dict(row) if row else None


def _row_to_dict(row) -> dict:
    """Convert SQLite row to dict."""
    return {
        "id": row[0],
        "session_id": row[1],
        "heart_rate": row[2],
        "bp_systolic": row[3],
        "bp_diastolic": row[4],
        "temperature": row[5],
        "weight": row[6],
        "recorded_at": row[7]
    }