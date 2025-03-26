from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3
from database import get_db_connection

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL do frontend Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class Transaction(BaseModel):
    id: Optional[int] = None
    date: str
    description: str
    amount: float
    category: str
    type: str

class Category(BaseModel):
    name: str
    type: str

# Rotas da API
@app.get("/transactions")
async def get_transactions():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM transactions ORDER BY date DESC")
        result = cursor.fetchall()
        # Converter Row objects para dicionários
        transactions = []
        for row in result:
            transactions.append({
                "id": row["id"],
                "date": row["date"],
                "description": row["description"],
                "amount": row["amount"],
                "category": row["category"],
                "type": row["type"]
            })
        return transactions
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/transactions")
async def create_transaction(transaction: Transaction):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO transactions (date, description, amount, category, type)
            VALUES (?, ?, ?, ?, ?)
        """, (
            transaction.date,
            transaction.description,
            transaction.amount,
            transaction.category,
            transaction.type
        ))
        conn.commit()
        new_id = cursor.lastrowid
        return {"id": new_id, "message": "Transação criada com sucesso"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/categories")
async def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()
    conn.close()
    return categories

@app.put("/transactions/{transaction_id}")
async def update_transaction(transaction_id: int, transaction: Transaction):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE transactions 
            SET date = ?, description = ?, amount = ?, category = ?, type = ?
            WHERE id = ?
        """, (
            transaction.date,
            transaction.description,
            transaction.amount,
            transaction.category,
            transaction.type,
            transaction_id
        ))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Transação não encontrada")
        return {"message": "Transação atualizada com sucesso"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM transactions WHERE id = ?", (transaction_id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Transação não encontrada")
        return {"message": "Transação excluída com sucesso"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close() 