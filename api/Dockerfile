FROM node:10.15.3-alpine

WORKDIR /usr/src/app
ADD package*.json ./

RUN npm install --silent

#Expose port and start application
EXPOSE 8000
CMD ["npm", "start"]

USER node