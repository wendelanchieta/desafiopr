#!/bin/sh

echo "--- Aguardando o banco de dados (db-orders:5432) ficar online... ---"
while ! nc -z db-orders 5432; do
  sleep 1
done
echo "--- Banco de dados detectado! ---"

echo "--- Verificando/Populando dados iniciais... ---"
python seed.py

echo "--- Iniciando FastAPI no modo Development ---"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload