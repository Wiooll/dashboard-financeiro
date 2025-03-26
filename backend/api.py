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

class Profile(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    familyName: str

class FamilyMember(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    accessLevel: str

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

@app.get("/profile")
async def get_profile():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM profiles LIMIT 1")
        profile = cursor.fetchone()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Perfil não encontrado")
            
        cursor.execute("SELECT * FROM family_members WHERE profile_id = ?", (profile['id'],))
        members = cursor.fetchall()
        
        return {
            "id": profile['id'],
            "name": profile['name'],
            "email": profile['email'],
            "familyName": profile['family_name'],
            "members": [
                {
                    "id": member['id'],
                    "name": member['name'],
                    "email": member['email'],
                    "accessLevel": member['access_level']
                }
                for member in members
            ]
        }
    finally:
        conn.close()

@app.post("/profile")
async def create_profile(profile: Profile):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO profiles (name, email, family_name)
            VALUES (?, ?, ?)
        """, (profile.name, profile.email, profile.familyName))
        conn.commit()
        new_id = cursor.lastrowid
        return {"id": new_id, "message": "Perfil criado com sucesso"}
    finally:
        conn.close()

@app.put("/profile")
async def update_profile(profile: Profile):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE profiles 
            SET name = ?, email = ?, family_name = ?
            WHERE id = ?
        """, (profile.name, profile.email, profile.familyName, profile.id))
        conn.commit()
        return {"message": "Perfil atualizado com sucesso"}
    finally:
        conn.close()

@app.post("/profile/members")
async def add_family_member(member: FamilyMember):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO family_members (profile_id, name, email, access_level)
            VALUES (?, ?, ?, ?)
        """, (member.id, member.name, member.email, member.accessLevel))
        conn.commit()
        new_id = cursor.lastrowid
        return {"id": new_id, "message": "Membro adicionado com sucesso"}
    finally:
        conn.close()

@app.put("/profile/members/{member_id}")
async def update_family_member(member_id: int, member: FamilyMember):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE family_members 
            SET name = ?, email = ?, access_level = ?
            WHERE id = ?
        """, (member.name, member.email, member.accessLevel, member_id))
        conn.commit()
        return {"message": "Membro atualizado com sucesso"}
    finally:
        conn.close()

@app.delete("/profile/members/{member_id}")
async def delete_family_member(member_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM family_members WHERE id = ?", (member_id,))
        conn.commit()
        return {"message": "Membro excluído com sucesso"}
    finally:
        conn.close() 