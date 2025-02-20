FROM node:20-alpine

WORKDIR /app

COPY ./docker/frontend/entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["entrypoint.sh"]

CMD ["npm", "run", "dev"]