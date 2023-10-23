FROM node:latest

ENV TOKEN =
ENV CLIENT_ID = 
ENV XAPIkey_ID = 

COPY . .
RUN npm install 

CMD [ "node", "index.js" ]