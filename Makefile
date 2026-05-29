.PHONY: up down logs db-push

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

db-push:
	pnpm --filter database push
