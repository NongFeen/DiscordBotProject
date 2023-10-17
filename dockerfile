FROM node:latest

ENV TOKEN =
ENV GUILD_ID = 
ENV CLIENT_ID = 
ENV XAPIkey_ID = 

COPY . .


CMD [ "node", "index.js" ]