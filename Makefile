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
	kompose convert --file docker-compose-prod.yml --chart --out node-fhir-server-mongo

.PHONY:helm
helm:
	helm lint ./node-fhir-server-mongo
	rm ./releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz
	helm package ./node-fhir-server-mongo --destination ./releases/node-fhir-server-mongo/ --app-version 1.0 --version 1.0

.PHONY: deploy
deploy:
	helm upgrade --install --set include_mongo=true node-fhir-server-mongo ./releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz
	helm ls