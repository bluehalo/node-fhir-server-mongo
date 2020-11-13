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

TOKEN_NAME := "$(shell kubectl -n kube-system get secret | awk '/^deployment-controller-token-/{print $$1}')"

.PHONY: dashboard-install
dashboard-install:
	kubectl version
	kubectl config current-context
	kubectl cluster-info
	kubectl delete -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.4/aio/deploy/recommended.yaml
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.4/aio/deploy/recommended.yaml
	kubectl get pods --all-namespaces
	echo "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/"
	# https://medium.com/backbase/kubernetes-in-local-the-easy-way-f8ef2b98be68
	echo "----------- Token ---------------"
	kubectl -n kube-system describe secret ${TOKEN_NAME} | awk '$$1=="token:"{print $$2}'
	echo "---------------------------------"
	kubectl proxy

.PHONY: dashboard
dashboard:
	kubectl version
	kubectl config current-context
	kubectl cluster-info
	kubectl get pods --all-namespaces
	echo "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/"
	# https://medium.com/backbase/kubernetes-in-local-the-easy-way-f8ef2b98be68
	echo "----------- Token ---------------"
	kubectl -n kube-system describe secret ${TOKEN_NAME} | awk '$$1=="token:"{print $$2}'
	echo "---------------------------------"
	kubectl proxy

.PHONY: dashboard-token
dashboard-token:
	kubectl -n kube-system describe secret ${TOKEN_NAME} | awk '$$1=="token:"{print $$2}'

.PHONY: nginx
nginx:
	helm repo add nginx-stable https://helm.nginx.com/stable
	helm repo update
	helm install my-release nginx-stable/nginx-ingress

.PHONY:run
run:
	kubectl expose deployment hello-world --type=NodePort --name=example-service