#!/bin/bash

printf "
        ######################################################
        ############### Creating infrastructure ##############
        ######################################################\n\n"

cd resources
terraform init
terraform plan -out tf-plan
terraform apply -auto-approve tf-plan

printf "
        ######################################################
        ####### Populating environment with credentials ######
        ######################################################\n\n"
export IMAGE_BUCKET=$(terraform output bucket)
DB_USER=$(terraform output db_user)
DB_PASSWORD=$(terraform output db_password)
DB_ENDPOINT=$(terraform output db_endpoint)
DB_NAME=$(terraform output db_name)
export DB_URI="mysql://${DB_USER}:${DB_PASSWORD}@${DB_ENDPOINT}/${DB_NAME}"
printf $DB_URI
cd -

printf "
        ######################################################
        ############## Installing dependencies ###############
        ######################################################\n\n"
npm run bootstrap
npm run start:prod
