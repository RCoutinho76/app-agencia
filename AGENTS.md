# AGENTS.md

Notas de operação deste repositório (o que não dá para deduzir dos manifestos).

## Stack

- `client/`: React 19 + TypeScript + Vite 7. Dev server em `0.0.0.0:3000`.
- `server/`: Express + `pg`, ESM, reinicia sozinho com `node --watch`.
- Banco: PostgreSQL 16 como serviço do compose (`db`), tabela `quotes` criada por `server/src/db.js`
  na inicialização (com retry enquanto o Postgres sobe).

## Ambiente de desenvolvimento

- Subir tudo: `docker compose -f docker-compose.base44.yml up -d` (host port 3000 → Vite).
- O Vite faz proxy de `/api` para `http://api:3001` (`VITE_API_PROXY_TARGET`). O front nunca chama a
  API por outra origem, então cookies/CORS não entram na conta.
- `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` é passado pelo compose para o Vite (>= 6.1) aceitar o host
  público do preview. Não hardcode hosts.
- Dependências são instaladas no start do container (`npm ci`) dentro de volumes nomeados
  (`web_node_modules`, `api_node_modules`). Ao mudar `package.json`, rode
  `npm install --package-lock-only` no diretório correspondente para manter o lockfile em sincronia,
  senão o `npm ci` falha no boot.
- Host não tem Node: comandos de teste/instalação rodam nos containers, ex.
  `docker compose -f docker-compose.base44.yml exec -T web npm run typecheck`.

## Verificação

- `curl http://localhost:3000/api/health` deve responder `{"status":"ok","db":"up"}`.
- Pedido de orçamento válido: `POST /api/quotes` com `name`, `email`, `destination`, `travelers` →
  201 com `id`. Payload inválido → 422 com `errors` por campo.
- Dados de teste podem ser apagados por `id`:
  `docker compose -f docker-compose.base44.yml exec -T db psql -U agency -d agency -c "DELETE FROM quotes WHERE id = <id>"`.
