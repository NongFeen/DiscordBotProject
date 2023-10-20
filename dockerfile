FROM node:latest

ENV TOKEN =
ENV GUILD_ID = 
ENV CLIENT_ID = 
ENV XAPIkey_ID = 

COPY . .

RUN npm install

CMD [ "node", "index.js" ]