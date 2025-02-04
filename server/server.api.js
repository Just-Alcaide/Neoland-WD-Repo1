// server.api.js
import * as http from "node:http";
import { crud } from "./server.crud.js";

import {User} from "../Proyecto-final/src/js/classes/User.js";

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  json: "application/json",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const USERS_URL = './server/BBDD/users.json'
const CLUBS_URL = './server/BBDD/clubs.json'
const PROPOSALS_URL = './server/BBDD/proposals.json'
const BOOKS_URL = './server/BBDD/books.json'
const MOVIES_URL = './server/BBDD/movies.json'

http
  .createServer(async (request, response) => {
    const url = new URL(`http://${request.headers.host}${request.url}`);
    const urlParams = Object.fromEntries(url.searchParams);

    

    const statusCode = 200
    let responseData = []
    console.log(url.pathname, url.searchParams);
    // Set Up CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', MIME_TYPES.json);
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(statusCode);

    if (request.method === 'OPTIONS') {
      response.end();
      return;
    }

    let newUser = new User(urlParams)

    switch (url.pathname) {
      case '/create/users':
        crud.create(USERS_URL, newUser, (data) => {
          console.log(`server ${data.name} creado`, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/read/users':
        crud.read(USERS_URL, (data) => {
          console.log('server read users', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/filter/users':
        crud.filter(USERS_URL, urlParams, (data) => {
          console.log('server filter users', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

      case '/create/clubs':
        crud.create(CLUBS_URL, urlParams, (data) => {
          console.log(`server ${data.name} creado`, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/read/clubs':
        crud.read(CLUBS_URL, (data) => {
          console.log('server read clubs', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/filter/clubs':
        crud.filter(CLUBS_URL, urlParams, (data) => {
          console.log('server filter clubs', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

      case '/create/proposals':
        crud.create(PROPOSALS_URL, urlParams, (data) => {
          console.log(`server ${data.name} creado`, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/read/proposals':
        crud.read(PROPOSALS_URL, (data) => {
          console.log('server read proposals', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/filter/proposals':
        crud.filter(PROPOSALS_URL, urlParams, (data) => {
          console.log('server filter proposals', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

      case '/create/books':
        crud.create(BOOKS_URL, urlParams, (data) => {
          console.log(`server ${data.name} creado`, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/read/books':
        crud.read(BOOKS_URL, (data) => {
          console.log('server read books', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/filter/books':
        crud.filter(BOOKS_URL, urlParams, (data) => {
          console.log('server filter books', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

      case '/create/movies':
        crud.create(MOVIES_URL, urlParams, (data) => {
          console.log(`server ${data.name} creado`, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/read/movies':
        crud.read(MOVIES_URL, (data) => {
          console.log('server read movies', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/filter/movies':
        crud.filter(MOVIES_URL, urlParams, (data) => {
          console.log('server filter movies', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

      default:
        console.log('no se encontro el endpoint');

        response.write(JSON.stringify('no se encontro el endpoint'));
        response.end();
        break;
    }
  })
  .listen(process.env.API_PORT, process.env.IP);

  console.log('Server running at http://' + process.env.IP + ':' + process.env.API_PORT + '/');