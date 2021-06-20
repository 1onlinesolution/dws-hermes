# =======================================================================
# To build a docker image:
# docker build -t dws-hermes:0.9.2 .
# =======================================================================
# To create/run a container from an image (with image_id)
# docker run --rm --env-file ./.env -d -p 7001:7001 --name dws-hermes image_id
# =======================================================================
FROM node:alpine

LABEL version="0.9.2"

WORKDIR ./
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]

