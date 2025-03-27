from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
from database import get_db_connection
from datetime import datetime

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

# Modelos Pydantic para Perfil
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

# Modelos Pydantic para Orçamento
class BudgetCategory(BaseModel):
    id: Optional[int] = None
    category: str
    limit: float
    spent: float
    alert: float

# Modelos Pydantic para Planejamento
class FinancialGoal(BaseModel):
    id: Optional[int] = None
    description: str
    targetValue: float
    currentValue: float
    deadline: str
    category: str

# Funções de banco de dados
def init_db():
    conn = sqlite3.connect('finance.db')
    c = conn.cursor()
    
    # Tabela de transações
    c.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            type TEXT NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
        )
    ''')
    
    # Tabela de perfis
    c.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            family_name TEXT NOT NULL
        )
    ''')
    
    # Tabela de membros da família
    c.execute('''
        CREATE TABLE IF NOT EXISTS family_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id INTEGER,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            access_level TEXT NOT NULL,
            FOREIGN KEY (profile_id) REFERENCES profiles (id)
        )
    ''')
    
    # Tabela de categorias de orçamento
    c.execute('''
        CREATE TABLE IF NOT EXISTS budget_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            limit_value REAL NOT NULL,
            spent REAL DEFAULT 0,
            alert REAL NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

# Inicializar o banco de dados
init_db()

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

# Endpoints de Perfil
@app.get("/profile")
async def get_profile():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM profiles LIMIT 1")
        profile = cursor.fetchone()
        
        if not profile:
            return {
                "id": None,
                "name": "",
                "email": "",
                "familyName": "",
                "members": []
            }
            
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
    except sqlite3.Error as e:
        print(f"Erro SQLite: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals():
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
        
        return {
            "id": new_id,
            "name": profile.name,
            "email": profile.email,
            "familyName": profile.familyName,
            "members": []
        }
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/profile/members")
async def add_family_member(member: FamilyMember):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM profiles LIMIT 1")
        profile = cursor.fetchone()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Perfil não encontrado")
            
        cursor.execute("""
            INSERT INTO family_members (profile_id, name, email, access_level)
            VALUES (?, ?, ?, ?)
        """, (profile['id'], member.name, member.email, member.accessLevel))
        conn.commit()
        new_id = cursor.lastrowid
        
        return {
            "id": new_id,
            "name": member.name,
            "email": member.email,
            "accessLevel": member.accessLevel
        }
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Endpoints de Orçamento
@app.get("/budget")
async def get_budget_categories():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM budget_categories")
        categories = cursor.fetchall()
        return [
            {
                "id": cat["id"],
                "category": cat["category"],
                "limit": cat["limit_value"],
                "spent": cat["spent"],
                "alert": cat["alert"]
            }
            for cat in categories
        ]
    finally:
        conn.close()

@app.post("/budget")
async def create_budget_category(category: BudgetCategory):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO budget_categories (category, limit_value, spent, alert)
            VALUES (?, ?, ?, ?)
        """, (category.category, category.limit, category.spent, category.alert))
        conn.commit()
        new_id = cursor.lastrowid
        return {"id": new_id, **category.dict()}
    finally:
        conn.close()

@app.put("/budget/{category_id}")
async def update_budget_category(category_id: int, category: BudgetCategory):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE budget_categories 
            SET category = ?, limit_value = ?, spent = ?, alert = ?
            WHERE id = ?
        """, (category.category, category.limit, category.spent, category.alert, category_id))
        conn.commit()
        return {"id": category_id, **category.dict()}
    finally:
        conn.close()

@app.delete("/budget/{category_id}")
async def delete_budget_category(category_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM budget_categories WHERE id = ?", (category_id,))
        conn.commit()
        return {"message": "Categoria excluída com sucesso"}
    finally:
        conn.close()

# Endpoints de Planejamento
@app.get("/planning/goals")
async def get_financial_goals():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM financial_goals")
        goals = cursor.fetchall()
        return [
            {
                "id": goal["id"],
                "description": goal["description"],
                "targetValue": goal["target_value"],
                "currentValue": goal["current_value"],
                "deadline": goal["deadline"],
                "category": goal["category"]
            }
            for goal in goals
        ]
    finally:
        conn.close()

@app.post("/planning/goals")
async def create_financial_goal(goal: FinancialGoal):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO financial_goals (description, target_value, current_value, deadline, category)
            VALUES (?, ?, ?, ?, ?)
        """, (goal.description, goal.targetValue, goal.currentValue, goal.deadline, goal.category))
        conn.commit()
        new_id = cursor.lastrowid
        return {"id": new_id, **goal.dict()}
    finally:
        conn.close()

@app.put("/planning/goals/{goal_id}")
async def update_financial_goal(goal_id: int, goal: FinancialGoal):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE financial_goals 
            SET description = ?, target_value = ?, current_value = ?, deadline = ?, category = ?
            WHERE id = ?
        """, (goal.description, goal.targetValue, goal.currentValue, goal.deadline, goal.category, goal_id))
        conn.commit()
        return {"id": goal_id, **goal.dict()}
    finally:
        conn.close()

@app.delete("/planning/goals/{goal_id}")
async def delete_financial_goal(goal_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM financial_goals WHERE id = ?", (goal_id,))
        conn.commit()
        return {"message": "Meta excluída com sucesso"}
    finally:
        conn.close()

# Endpoint de Relatórios
@app.get("/reports")
async def get_financial_report(period: str = "6"):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Calcular totais
        cursor.execute("""
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
            FROM transactions
            WHERE date >= date('now', ?)
        """, (f'-{period} months',))
        
        totals = cursor.fetchone()
        total_income = totals["total_income"] or 0
        total_expenses = totals["total_expenses"] or 0
        savings = total_income - total_expenses
        savings_rate = (savings / total_income * 100) if total_income > 0 else 0
        
        # Dados de evolução
        cursor.execute("""
            SELECT 
                strftime('%Y-%m', date) as month,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
            FROM transactions
            WHERE date >= date('now', ?)
            GROUP BY month
            ORDER BY month
        """, (f'-{period} months',))
        
        evolution_data = cursor.fetchall()
        
        # Gastos por categoria
        cursor.execute("""
            SELECT 
                category,
                SUM(amount) as total
            FROM transactions
            WHERE type = 'expense'
            AND date >= date('now', ?)
            GROUP BY category
        """, (f'-{period} months',))
        
        expenses_by_category = cursor.fetchall()
        
        return {
            "totalIncome": total_income,
            "totalExpenses": total_expenses,
            "savings": savings,
            "savingsRate": savings_rate,
            "evolutionData": {
                "labels": [row["month"] for row in evolution_data],
                "data": [row["income"] - row["expenses"] for row in evolution_data]
            },
            "expensesByCategory": {
                "labels": [row["category"] for row in expenses_by_category],
                "data": [row["total"] for row in expenses_by_category]
            },
            "monthlyComparison": {
                "labels": [row["month"] for row in evolution_data],
                "income": [row["income"] for row in evolution_data],
                "expenses": [row["expenses"] for row in evolution_data]
            }
        }
    finally:
        conn.close() 