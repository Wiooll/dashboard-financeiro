# Backend da Dashboard Financeira

Este diretório contém a implementação do backend da dashboard financeira utilizando Python e SQLite.

## Estrutura do Banco de Dados

O banco de dados possui duas tabelas principais:

### Tabela `transactions`

- Armazena todas as transações financeiras
- Campos:
  - id: Identificador único
  - date: Data da transação
  - description: Descrição da transação
  - amount: Valor da transação
  - category: Categoria da transação
  - type: Tipo (receita/despesa)
  - created_at: Data de criação do registro

### Tabela `categories`

- Armazena as categorias disponíveis para transações
- Campos:
  - id: Identificador único
  - name: Nome da categoria
  - type: Tipo (receita/despesa)

## Configuração

1. Instale as dependências:

```bash
pip install -r requirements.txt
```

2. Inicialize o banco de dados:

```bash
python database.py
```

O banco de dados será criado automaticamente no arquivo `finance.db` com algumas categorias padrão.

## Uso

Para usar o banco de dados em seu código Python:

```python
from database import get_db_connection

# Obter uma conexão com o banco de dados
conn = get_db_connection()
cursor = conn.cursor()

# Exemplo de consulta
cursor.execute("SELECT * FROM transactions")
transactions = cursor.fetchall()

# Não se esqueça de fechar a conexão
conn.close()
```
