.PHONY: up down restart logs sh migrate seed fresh install help up-build

# Variáveis
DC = docker compose
APP = docker compose exec app

help:
	@echo "Comandos disponíveis:"
	@echo "  make up       - Sobe os containers em background"
	@echo "  make up-build - Sobe os containers com build"
	@echo "  make down     - Derruba os containers"
	@echo "  make restart  - Reinicia os containers"
	@echo "  make logs     - Exibe os logs da aplicação"
	@echo "  make sh       - Acessa o terminal do container da API"
	@echo "  make migrate  - Roda as migrations do banco de dados"
	@echo "  make seed     - Roda os seeders do banco de dados"
	@echo "  make fresh    - Reseta o banco de dados e roda as migrations e seeders"
	@echo "  make install  - Roda npm install dentro do container"

up:
	@echo "Subindo os containers..."
	$(DC) up -d

down:
	@echo "Derrubando os containers..."
	$(DC) down

up-build:
	@echo "Subindo os containers com build..."
	$(DC) up --build

restart:
	$(DC) restart

logs:
	$(DC) logs -f app

sh:
	$(APP) sh

migrate:
	@echo "Rodando migrations..."
	$(APP) node ace migration:run --force

seed:
	@echo "Rodando seeders..."
	$(APP) node ace db:seed

fresh:
	@echo "Resetando o banco de dados..."
	$(APP) node ace migration:fresh --seed

install:
	@echo "Instalando dependências..."
	$(APP) npm install
