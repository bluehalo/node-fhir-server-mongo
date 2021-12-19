.PHONY:build
build:
	docker build -t imranq2/node-fhir-server-mongo:local .

.PHONY:publish
publish:
	docker push imranq2/node-fhir-server-mongo:latest
	docker push imranq2/node-fhir-server-mongo:1.2.71

.PHONY:up
up:
	docker-compose -f docker-compose.yml  -p fhir-dev build --parallel && \
	docker-compose -p fhir-dev -f docker-compose.yml up --detach && \
	echo "waiting for Fhir server to become healthy" && \
	while [ "`docker inspect --format {{.State.Health.Status}} fhir-dev_fhir_1`" != "healthy" ]; do printf "." && sleep 2; done
	echo FHIR server GraphQL: http://localhost:3000/graphql && \
	echo FHIR server: http://localhost:3000/

.PHONY:up-offline
up-offline:
	docker-compose -p fhir-dev -f docker-compose.yml up --detach && \
	echo "waiting for Fhir server to become healthy" && \
	while [ "`docker inspect --format {{.State.Health.Status}} fhir-dev_fhir_1`" != "healthy" ]; do printf "." && sleep 2; done
	echo FHIR server GraphQL: http://localhost:3000/graphql && \
	echo FHIR server: http://localhost:3000/

.PHONY:down
down:
	docker-compose -p fhir-dev -f docker-compose.yml down && \
	docker system prune -f

.PHONY:clean
clean: down
	docker image rm imranq2/node-fhir-server-mongo -f
	docker image rm node-fhir-server-mongo_fhir -f
	docker volume rm fhir-dev_mongo_data -f

.PHONY:init
init:
	brew update  # update brew
	#brew upgrade  # upgrade all installed packages
	brew install yarn
	brew install kompose
	#brew install nvm
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.37.2/install.sh | zsh
	nvm install 16.13
	make update

#   We use gitpkg to expose the subfolder as a package here.
#	When you change the package go here to create a new link: https://gitpkg.vercel.app/ using the path:
# https://github.com/icanbwell/node-fhir-server-core/tree/master/packages/node-fhir-server-core
# 	yarn cache clean && \
#	yarn --update-checksums && \
# 	cd node_modules/@asymmetrik/node-fhir-server-core && yarn install
# "@asymmetrik/node-fhir-server-core": "https://gitpkg.now.sh/icanbwell/node-fhir-server-core/packages/node-fhir-server-core?master",

.PHONY:update
update:
	. ${NVM_DIR}/nvm.sh && nvm use 16.13.0 && \
	yarn install --no-optional && \
	npm i --package-lock-only

.PHONY:tests
tests:
	. ${NVM_DIR}/nvm.sh && nvm use 16.13.0 && \
	npm test

.PHONY:tests_integration
tests_integration:
	. ${NVM_DIR}/nvm.sh && nvm use 16.13.0 && \
	npm run test:integration

.PHONY:tests_everything
tests_everything:
	. ${NVM_DIR}/nvm.sh && nvm use 16.13.0 && \
	npm run test:everything

.PHONY:tests_graphql
tests_graphql:
	. ${NVM_DIR}/nvm.sh && nvm use 16.13.0 && \
	npm run test:graphql

.PHONY:lint
lint:
	. ${NVM_DIR}/nvm.sh && nvm use 16.13.0 && \
	npm run test:lint && \
	npm run test:ejslint

.PHONY:generate
generate:
	python3 src/services/generate_services.py

.PHONY:shell
shell: ## Brings up the bash shell in dev docker
	docker-compose -p fhir-dev -f docker-compose.yml run --rm --name fhir fhir /bin/sh

.PHONY:clean-pre-commit
clean-pre-commit: ## removes pre-commit hook
	rm -f .git/hooks/pre-commit

.PHONY:setup-pre-commit
setup-pre-commit:
	cp ./pre-commit-hook ./.git/hooks/pre-commit

.PHONY:run-pre-commit
run-pre-commit: setup-pre-commit
	./.git/hooks/pre-commit

.PHONY:graphql
graphql:
	python3 src/graphql/generator/generate_classes.py && \
	graphql-schema-linter
