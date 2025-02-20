FROM node:20-alpine

WORKDIR /app

COPY ./docker/backend/entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["entrypoint.sh"]

CMD ["npm", "run", "dev:server"]