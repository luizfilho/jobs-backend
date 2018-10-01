FROM node:latest

RUN useradd --user-group --create-home --shell /bin/false app &&\
    npm install --global npm@6.4.1

ENV HOME=/home/app
##Pasta dentro do container
##npm shrinkwrap corre por todas as versões cria um arquivo com a versão exata.
COPY package.json npm-shrinkwrap.json $HOME/apioabvagas/ 
##Permissão pro usuario na pastas home
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/apioabvagas

RUN npm cache verify && npm install --silent --progress=false

USER root 
##Move tudo 
COPY . $HOME/apioabvagas

RUN chown -R app:app $HOME/*
USER app

EXPOSE 3000

CMD ["npm","start"]
