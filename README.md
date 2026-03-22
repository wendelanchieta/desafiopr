# DESAFIO PR

## Decisões Técnicas e Justificativas

1. Backend: Framework FastAPIA escolha pelo FastAPI baseia-se nos seguintes pontos:
   * Performance: Operações assíncronas nativas (async/await) que permitem maior vazão de requisições;
   * Documentação: Geração automática e em tempo real de schemas OpenAPI (Swagger), facilitando a integração entre times;
   * Contratos de Dados: Uso de [Pydantic](https://docs.pydantic.dev/latest/) para validação rigorosa de dados logo na entrada da API.
  
2. Frontend: Microfrontends (MFE) com React para atender à necessidade de frontends independentes e integrados, adotou-se a estratégia de Module Federation:
   * Independência: O MFE de Pedidos pode sofrer manutenção e deploy sem afetar o MFE Shell/Host;
   * Consistência: O Shell atua como orquestrador, garantindo que o usuário tenha uma experiência de Single Page Application (SPA) unificada;
   * Comunicação: Ocorre via eventos customizados no navegador ou estado global compartilhado para evitar acoplamento direto.

3. Persistência de Dados: PostgreSQL & Redis seguindo o princípio de isolamento de microsserviços, cada serviço gerencia seu próprio estado:
   * PostgreSQL: Utilizado como banco relacional primário para garantir a integridade transacional de pedidos e usuários;
   * Redis: Implementado como camada de bônus para atuar como broker de mensagens assíncronas e cache de sessões JWT.
  
4. Integração com IA (Bônus)
   Será implementada uma interface simples de IA para sugerir prioridade de pedidos:

   * Arquitetura Assíncrona: Para não impactar a experiência do usuário, a análise de prioridade é disparada via fila (Redis), permitindo que o sistema responda instantaneamente enquanto a IA processa em background.


> `RASCUNHO`

