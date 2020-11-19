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

.PHONY:tests_integration
tests_integration:
	npm run test:integration

.PHONY:generate
generate:
	python3 src/services/generate_services.py

.PHONY:kompose
kompose:
	kompose convert --file docker-compose-prod.yml --chart --out node-fhir-server-mongo

.PHONY:helm
helm:
	helm lint --strict ./node-fhir-server-mongo
	rm ./releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz
	helm package ./node-fhir-server-mongo --destination ./releases/node-fhir-server-mongo/ --app-version 1.0 --version 1.0

.PHONY: clean-helm
clean-helm:
	helm delete node-fhir-server-mongo

.PHONY: deploy
deploy:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	kubectl config use-context docker-desktop && \
	helm upgrade --install --set include_mongo=true node-fhir-server-mongo ./releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz
	helm ls

.PHONY: deploy-from-github
deploy-from-github:
	helm upgrade --install --set include_mongo=true node-fhir-server-mongo https://raw.githubusercontent.com/imranq2/node-fhir-server-mongo/master/releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz
	helm ls

.PHONY: deploy_local_to_aws
deploy_local_to_aws:
	read -p "Enter Mongo Password:" mongoPassword; \
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl config current-context && \
	kubectl cluster-info && \
	kubectl get services && \
	helm upgrade --install --set include_mongo=true --set use_ingress=true --set aws=true --set mongoPassword=$$mongoPassword node-fhir-server-mongo ./releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz && \
	helm ls && \
	kubectl get services && \
	kubectl get all --namespace=nodefhirservermongo && \
	kubectl get deployment.apps/fhir --namespace=nodefhirservermongo -o yaml && \
	kubectl logs deployment.apps/fhir --namespace=nodefhirservermongo


.PHONY: deploy_to_aws
deploy_to_aws:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl config current-context && \
	kubectl cluster-info && \
	kubectl get services


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

.PHONY:mongoclient
mongoclient:
	kubectl exec --stdin --tty deployment.apps/mongoclient --namespace=nodefhirservermongo -- /bin/bash

.PHONY:logs
logs:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl config current-context && \
	kubectl cluster-info && \
	kubectl --namespace=nodefhirservermongo get all  && \
	kubectl --namespace=nodefhirservermongo get pods --selector=io.kompose.service=fhir && \
	kubectl --namespace=nodefhirservermongo get endpoints  && \
	echo "----------------- Mongo logs -------------" && \
	kubectl --namespace=nodefhirservermongo logs deployment.apps/mongo && \
	echo "----------------- FHIR logs -------------" && \
	kubectl --namespace=nodefhirservermongo logs --follow deployment.apps/fhir 

.PHONY:diagnose
diagnose:
	kubectl get all --all-namespaces
	kubectl --namespace=nodefhirservermongo run client --image=appropriate/curl --rm -ti --restart=Never --command -- curl http://fhir:3000/4_0_0/metadata
	kubectl --namespace=nodefhirservermongo logs --previous deployment.apps/fhir 
	kubectl --namespace=nodefhirservermongo delete pod/fhir-84d98fdf6d-4bsrz

.PHONY: busybox
busybox:
	kubectl exec --stdin --tty pod/busybox --namespace=nodefhirservermongo -- /bin/bash