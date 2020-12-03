.PHONY:build
build:
	docker build .

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

.PHONY:kompose
kompose:
	kompose convert --file docker-compose-prod.yml --chart --out node-fhir-server-mongo

.PHONY:helm
helm:
	helm lint --strict ./node-fhir-server-mongo
	rm ./releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz
	helm package ./node-fhir-server-mongo --destination ./releases/node-fhir-server-mongo/ --app-version 1.0 --version 1.0

.PHONY: clean-helm-dev
clean-helm-dev:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	helm delete fhir-dev

.PHONY: deploy
deploy:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	kubectl config use-context docker-desktop && \
	helm upgrade --install --set include_mongo=true fhir-dev ./releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz
	helm ls

.PHONY: deploy-from-github
deploy-from-github:
	read -p "Enter Mongo Password:" mongoPassword; \
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl config current-context && \
	kubectl cluster-info && \
	kubectl get services && \
	helm upgrade --install --set namespace=fhir-dev --set fhir.replicas=3 --set fhir.mongo_db_name=fhir_dev --set fhir.ingress_name=fhir.dev.icanbwell.com --set include_mongo=false --set use_ingress=true --set aws=true --set mongoPassword=$$mongoPassword https://raw.githubusercontent.com/imranq2/node-fhir-server-mongo/master/releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz && \
	helm ls && \
	kubectl get services && \
	kubectl get all --namespace=fhir-dev && \
	kubectl get deployment.apps/fhir --namespace=fhir-dev -o yaml && \
	kubectl logs deployment.apps/fhir --namespace=fhir-dev

.PHONY: deploy_local_to_aws_dev
deploy_local_to_aws_dev:
	read -p "Enter Mongo Password:" mongoPassword; \
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl config current-context && \
	kubectl cluster-info && \
	kubectl get services && \
	helm upgrade --install --set namespace=fhir-dev --set fhir.node_memory=8096 --set fhir.replicas=3 --set fhir.mongo_db_name=fhir_dev --set fhir.ingress_name=fhir.dev.icanbwell.com --set include_mongo=false --set use_ingress=true --set aws=true --set mongoPassword=$$mongoPassword fhir-dev ./releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz && \
	helm ls && \
	kubectl get services && \
	kubectl get all --namespace=fhir-dev && \
	kubectl get deployment.apps/fhir --namespace=fhir-dev -o yaml && \
	kubectl --namespace=fhir-dev get pods -A -o=custom-columns='DATA:spec.containers[*].image' && \
	kubectl --namespace=fhir-dev logs deployment.apps/fhir 

.PHONY: deploy_local_to_aws_staging
deploy_local_to_aws_staging:
	read -p "Enter Mongo Password:" mongoPassword; \
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl config current-context && \
	kubectl cluster-info && \
	kubectl get services && \
	helm upgrade --install --set namespace=fhir-staging --set fhir.node_memory=8096 --set fhir.replicas=3 --set fhir.mongo_db_name=fhir_staging --set fhir.ingress_name=fhir-staging.dev.icanbwell.com --set include_mongo=false --set use_ingress=true --set aws=true --set mongoPassword=$$mongoPassword fhir-staging ./releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz && \
	helm ls && \
	kubectl get services && \
	kubectl get all --namespace=fhir-staging && \
	kubectl get deployment.apps/fhir --namespace=fhir-staging -o yaml && \
	kubectl --namespace=fhir-staging get pods -A -o=custom-columns='DATA:spec.containers[*].image' && \	
	kubectl logs deployment.apps/fhir --namespace=fhir-staging

.PHONY: deploy_local_to_aws_pre-prod
deploy_local_to_aws_pre-prod:
	read -p "Enter Mongo Password:" mongoPassword; \
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl config current-context && \
	kubectl cluster-info && \
	kubectl get services && \
	helm upgrade --install --set namespace=fhir-pre-prod --set fhir.node_memory=8096 --set fhir.replicas=3 --set fhir.mongo_db_name=fhir_pre_prod --set fhir.ingress_name=fhir-pre-prod.dev.icanbwell.com --set include_mongo=false --set use_ingress=true --set aws=true --set mongoPassword=$$mongoPassword fhir-pre-prod ./releases/node-fhir-server-mongo/node-fhir-server-mongo-1.0.tgz && \
	helm ls && \
	kubectl get services && \
	kubectl get all --namespace=fhir-pre-prod && \
	kubectl get deployment.apps/fhir --namespace=fhir-pre-prod -o yaml && \
	kubectl --namespace=fhir-pre-prod get pods -A -o=custom-columns='DATA:spec.containers[*].image' && \	
	kubectl logs deployment.apps/fhir --namespace=fhir-pre-prod

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

# .PHONY: dashboard-token
# dashboard-token:
# 	kubectl -n kube-system describe secret ${TOKEN_NAME} | awk '$$1=="token:"{print $$2}'

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
	kubectl exec --stdin --tty deployment.apps/mongo --namespace=fhir-dev -- /bin/bash

.PHONY:logs-dev
logs-dev:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl config current-context && \
	kubectl cluster-info && \
	kubectl --namespace=fhir-dev get all  && \
	kubectl --namespace=fhir-dev get pods --selector=io.kompose.service=fhir && \
	kubectl --namespace=fhir-dev get endpoints  && \
	echo "----------------- FHIR logs -------------" && \
	kubectl --namespace=fhir-dev logs --follow deployment.apps/fhir

.PHONY:logs-staging
logs-staging:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl config current-context && \
	kubectl cluster-info && \
	kubectl --namespace=fhir-staging get all  && \
	kubectl --namespace=fhir-staging get pods --selector=io.kompose.service=fhir && \
	kubectl --namespace=fhir-staging get endpoints  && \
	echo "----------------- FHIR logs -------------" && \
	kubectl --namespace=fhir-staging logs --follow deployment.apps/fhir

.PHONY:logs-pre-prod
logs-pre-prod:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl config current-context && \
	kubectl cluster-info && \
	kubectl --namespace=fhir-pre-prod get all  && \
	kubectl --namespace=fhir-pre-prod get pods --selector=io.kompose.service=fhir && \
	kubectl --namespace=fhir-pre-prod get endpoints  && \
	echo "----------------- FHIR logs -------------" && \
	kubectl --namespace=fhir-pre-prod logs --follow deployment.apps/fhir

.PHONY:diagnose
diagnose:
	kubectl get all --all-namespaces
	kubectl --namespace=fhir-dev run client --image=appropriate/curl --rm -ti --restart=Never --command -- curl http://fhir:3000/4_0_0/metadata
	kubectl --namespace=fhir-dev logs --previous deployment.apps/fhir
	kubectl --namespace=fhir-dev delete pod/fhir-84d98fdf6d-4bsrz
	kubectl --namespace=fhir-dev logs --tail=30 deployment.apps/fhir

.PHONY: busybox
busybox:
	kubectl exec --stdin --tty pod/busybox --namespace=fhir-dev -- /bin/bash

.PHONY: test_mongo_in_container
test_mongo_in_container:
	apt-get update
	apt install wget
	wget https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem
	mongo --ssl --host dev-fhir-db.cluster-ckvm0jix2koe.us-east-1.docdb.amazonaws.com:27017 --sslCAFile rds-combined-ca-bundle.pem --username mongoadmin --password <insertYourPassword>

.PHONY: helm-delete-dev
helm-delete-dev:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	helm delete fhir-dev

.PHONY: helm-delete-staging
helm-delete-staging:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	helm delete fhir-staging

.PHONY: secrets
secrets:
	$(eval HASSECRET=$(shell sh -c "kubectl --namespace=fhir-dev get secret mongoPassword")) ; echo $(HASSECRET)

.PHONY: dashboard-token
dashboard-token:
	export KUBECONFIG="${HOME}/.kube/config:${HOME}/.kube/config-dev-eks.config.yaml" && \
	aws-vault exec human-admin@bwell-dev -- aws s3 ls && \
	kubectl config use-context arn:aws:eks:us-east-1:875300655693:cluster/dev-eks-cluster && \
	kubectl -n kube-system describe secret $$(kubectl -n kube-system get secret | grep kubernetes-dashboard-token | awk '{print $$1}') | grep -E '^token:    ' | awk '{print $$2}'
	echo "https://kubernetes-dashboard.dev.icanbwell.com/#/login"