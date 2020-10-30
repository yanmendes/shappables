#!/bin/bash

printf "
        ######################################################
        ############### Creating infrastructure ##############
        ######################################################\n\n"

cd resources
# terraform init
# terraform plan -out tf-plan
# terraform apply -auto-approve tf-plan

printf "
        ######################################################
        ####### Populating environment with credentials ######
        ######################################################\n\n"
export IMAGE_BUCKET=$(terraform output bucket)
cd -

printf "
        ######################################################
        ############## Installing dependencies ###############
        ######################################################\n\n"
npm run bootstrap
npm run start:prod
