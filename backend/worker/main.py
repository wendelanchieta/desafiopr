import redis
import json
import time
import os
from sqlalchemy import create_engine, text

# Configurações de ambiente
REDIS_URL = os.getenv("REDIS_URL", "redis://redis-broker:6379/0")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:desafioPrPedidos@db-orders:5432/orders_db")

# Conexão com o Banco de Dados (PostgreSQL)
engine = create_engine(DATABASE_URL)

def update_order_priority(order_id, priority_label):
    """
    Simula a atualização de um campo de prioridade ou nota interna no pedido.
    Para este PMV, vamos apenas concatenar a info ao status ou descrição.
    """
    with engine.connect() as conn:
        query = text("UPDATE orders SET status = :status WHERE id = :id")
        conn.execute(query, {"status": f"Processando ({priority_label})", "id": order_id})
        conn.commit()
        print(f" [x] Pedido {order_id} atualizado para: {priority_label}")

def analyze_priority(description):
    """
    Simulação de lógica de IA: Identifica palavras-chave para definir urgência.
    """
    description = description.lower()
    if any(word in description for word in ["urgente", "emergência", "crítico", "rápido"]):
        return "ALTA PRIORIDADE"
    return "Prioridade Normal"

def start_worker():
    r = redis.from_url(REDIS_URL)
    pubsub = r.pubsub()
    pubsub.subscribe("order_priority_queue")

    print(" [*] Worker de IA aguardando mensagens no Redis. Para sair pressione CTRL+C")
    
    for message in pubsub.listen():
        if message['type'] == 'message':
            data = json.loads(message['data'])
            order_id = data['order_id']
            description = data['description']
            
            print(f" [v] Analisando Pedido #{order_id}: '{description}'")
            
            # Simula o tempo de processamento de uma IA real
            time.sleep(2) 
            
            priority = analyze_priority(description)
            update_order_priority(order_id, priority)

if __name__ == "__main__":
    start_worker()