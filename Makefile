# Makefile for managing Docker Compose
include .env

# Run the Docker Compose services
du:
	docker-compose up -d --build

# Run the LLM
llm:
	docker exec -it ollama ollama run ${LLM_NAME}

# Show the LLM list
llm-l:
	docker exec -it ollama ollama list

# Show the LLM logs
llm-ps:
	docker exec -it ollama ollama ps

# Pull the latest version of the LLM
llm-p:
	docker exec -it ollama ollama pull ${LLM_NAME}

# Remove the LLM
llm-r:
	docker exec -it ollama ollama rm ${LLM_NAME}

# Show the LLM version
llm-v:
	docker exec -it ollama ollama -v

# Build the Docker Compose services
db:
	docker-compose build

# Stop the Docker Compose services
ds:
	docker-compose stop

# Destroy the Docker Compose services and remove containers, networks, and volumes
dd:
	docker-compose down -v

# Show the Docker Compose services logs detached
dl:
	docker-compose logs

# Show the Docker Compose services logs
dlf:
	docker-compose logs -f

# Enter the Ollama container
de:
	docker-compose exec frontend sh