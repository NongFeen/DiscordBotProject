FROM node:latest

ENV TOKEN =
ENV CLIENT_ID = 
ENV XAPIkey_ID = 
COPY run.sh /run.sh
RUN chmod +x /run.sh
COPY . .
RUN npm install 

# CMD [ "node", "index.js" ]
CMD [ "/run.sh" ]