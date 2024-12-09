FROM node:latest

COPY run.sh /run.sh
RUN chmod +x /run.sh
COPY . .
RUN npm install 
RUN ls -l /
# CMD [ "node", "index.js" ]
CMD [ "/run.sh" ]