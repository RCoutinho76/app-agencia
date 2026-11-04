# Por Aí Turismo — Agência de Viagens

Aplicativo da agência **Por Aí Turismo** (Carla & Renato): site institucional com vitrine de
destinos, pacotes, depoimentos e formulário de pedido de orçamento que grava as solicitações em
banco de dados.

## Estrutura

```
client/        Front-end React + TypeScript servido pelo Vite (porta 3000)
server/        API Express (porta 3001) com catálogo e persistência dos orçamentos
docker-compose.base44.yml   Ambiente de desenvolvimento completo (web + api + postgres)
```

## Como rodar

```bash
docker compose -f docker-compose.base44.yml up -d
```

- Site: http://localhost:3000
- API: http://api:3001 (interna) — exposta ao navegador via proxy `/api` do Vite
- Banco: PostgreSQL 16, com as credenciais de desenvolvimento declaradas no compose

Os pedidos de orçamento são gravados na tabela `quotes`. A tabela é criada automaticamente na
inicialização da API.

## Endpoints

| Método | Rota           | Descrição                                      |
| ------ | -------------- | ---------------------------------------------- |
| GET    | `/api/health`  | Estado da API e do banco                       |
| GET    | `/api/catalog` | Destinos, pacotes e depoimentos                |
| POST   | `/api/quotes`  | Registra um pedido de orçamento                |

## Desenvolvimento

- `client`: `npm run dev` (Vite com proxy para a API), `npm run build`, `npm run typecheck`
- `server`: `npm run dev` (`node --watch`)
