FROM node:latest

COPY run.sh /run.sh
RUN chmod +x /run.sh

RUN ls -l /

COPY . .

RUN ls -l /app

RUN npm install 

CMD [ "/run.sh" ]
