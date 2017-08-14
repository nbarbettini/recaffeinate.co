# Makefile
#
# This file contains some helper scripts for building / deploying this site.

build:
	rm -rf public
	hugo

deploy: build
	aws s3 sync public/ s3://www.recaffeinate.co --exclude 'css/*' --exclude 'fonts/*' --exclude 'img/*' --acl public-read --delete --cache-control Max-Age=604800
	aws s3 sync public/css/ s3://www.recaffeinate.co/css --acl public-read --delete --cache-control Max-Age=2419200
	aws s3 sync public/img/ s3://www.recaffeinate.co/img --acl public-read --delete --cache-control Max-Age=2419200
	aws s3 sync public/fonts/ s3://www.recaffeinate.co/fonts --acl public-read --delete --cache-control Max-Age=2419200
	aws configure set preview.cloudfront true
	aws cloudfront create-invalidation --distribution-id E2HWCYCWSIKLXE --paths '/*'
