FROM node:latest

COPY run.sh ./run.sh
RUN chmod +x ./run.sh
COPY . .
RUN npm install 

# CMD [ "node", "index.js" ]
CMD [ "./run.sh" ]