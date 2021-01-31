.PHONY:build
build:
	docker build -t imranq2/node-fhir-server-mongo:latest -t imranq2/node-fhir-server-mongo:1.2.71 .

.PHONY:publish
publish:
	docker push imranq2/node-fhir-server-mongo:latest
	docker push imranq2/node-fhir-server-mongo:1.2.71

.PHONY:up
up:
	docker-compose -p fhir-dev -f docker-compose.yml up --detach

.PHONY:down
down:
	docker-compose -p fhir-dev -f docker-compose.yml down

.PHONY:clean
clean: down
	docker image rm imranq2/node-fhir-server-mongo -f
	docker image rm node-fhir-server-mongo_fhir -f
	docker volume rm fhir-dev_mongo_data -f

.PHONY:init
init:
	brew install yarn
	brew install kompose
	npm install

.PHONY:update
update:
	npm install

.PHONY:tests
tests:
	npm test

.PHONY:tests_integration
tests_integration:
	npm run test:integration

.PHONY:tests_everything
tests_everything:
	npm run test:everything

.PHONY:generate
generate:
	python3 src/services/generate_services.py

