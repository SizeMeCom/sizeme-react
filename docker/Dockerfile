FROM 131414752092.dkr.ecr.eu-west-1.amazonaws.com/sizeme.js:latest AS sizeme_js

FROM nginx

WORKDIR /sizeme

COPY sizeme-logo.png .
COPY default.conf /etc/nginx/conf.d
COPY sizeme.conf /etc/nginx/conf.d

COPY --from=sizeme_js /sizeme/2.2 2.2/
COPY --from=sizeme_js /sizeme/2.3 2.3/
ADD dist 3.0/
