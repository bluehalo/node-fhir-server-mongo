.PHONY:up
up:
	docker-compose -p node-fhir-server-mongo -f docker-compose.yml up --detach

.PHONY:down
down:
	docker-compose -p node-fhir-server-mongo -f docker-compose.yml down

.PHONY:clean
clean: down
	docker image rm imranq2/node-fhir-server-mongo -f
	docker image rm node-fhir-server-mongo_fhir
	docker volume rm node-fhir-server-mongo_mongo_data

.PHONY:init
init:
	brew install yarn
	brew install kompose

.PHONY:tests
tests:
	npm test

.PHONY:generate
generate:
	python3 src/services/generate_services.py

.PHONY:kompose
kompose:
	kompose convert --file docker-compose.yml --chart --out node-fhir-server-mongo
	kompose convert --file docker-compose-no-mongo.yml --chart --out node-fhir-server-no-mongo

.PHONY:helm
helm:
	helm lint ./node-fhir-server-mongo
	helm package ./node-fhir-server-mongo

.PHONY: deploy
deploy:
	helm create node-fhir-server-mongo