#!/bin/sh

# Aguarda o banco de dados de usuários ficar pronto
echo "--- Aguardando db-users (5432)... ---"
while ! nc -z db-users 5432; do
  sleep 1
done
echo "--- db-users online! ---"

# Inicia o servidor
exec uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload