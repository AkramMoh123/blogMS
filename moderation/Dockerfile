# get the base image
FROM node:alpine

WORKDIR /app
# install the required dependecies
COPY ./package.json ./
RUN npm install

COPY ./ ./

# specify command to run on containr startup
CMD ["npm", "start"]