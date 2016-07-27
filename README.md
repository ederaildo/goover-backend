[![Goover Logo](http://gooverbackend-gooverprd.rhcloud.com/images/logo.png)](http://www.gooverapp.com/)


# Goover Backend

## Sobre

Goover é um aplicativo que demonstra a tendência de público para os diversos programas ou séries da TV (Aberta e Paga), Stream  e canais de Internet.

O Backend faz o gerencimaneto de todos os cadastros de Programas, Categorias, Gêneros etc. e utiliza Módulo [Keystone.JS](http://www.keystonejs.com/) como FrontEnd.

## Pré Requisitos

Para instalar e executar é preciso ter as seguintes ferramentas instaladas:

* [MongoDB](www.mongodb.org)
* [NPM (Node.Js)](www.npm.org)

## Instalação

O Goover Backend foi construído sob o Node.JS.
Para a instalação é preciso ter o NPM instalado, ir no diretório raiz e executar o comando:

```
npm install
```

No arquivo .env estão disponíveis as configurações de banco de dados para conexão.

## Run

Para subir o servidor com a aplicação, é necessário o MongoDB com a base de dados gooverdb estar rodando localmente.

```
node keystone
```

O servidor irá rodar em localhost porta 3000. Então é só acessar no browser:

```
http://localhost:3000
```

## Contributors



## License