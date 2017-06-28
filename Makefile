# Makefile
#
# This file contains some helper scripts for building / deploying this site.

build:
	rm -rf public
	hugo

develop:
	rm -rf public
	hugo server --watch

deploy: build
	aws s3 sync public/ s3://www.recaffeinate.co --acl public-read --delete
	aws configure set preview.cloudfront true
	aws cloudfront create-invalidation --distribution-id E2HWCYCWSIKLXE --paths '/*'
