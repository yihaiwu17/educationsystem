// mirage.js
import { createServer, Model, Response, Server } from 'miragejs';
import { firstPaths } from '../services/path';
const students = require('./student.json');
const users = require('./user.json');

export function makeServer({ environment = 'test' } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      student: Model,
    },

    seeds(server) {
      users.forEach((user) => server.create('user', user));
      students.forEach((student) => server.create('student', student));
    },

    routes() {
      this.passthrough((request) => {
        if (request.url === '/_next/static/development/_devPagesManifest.json') return true;
      });

      this.namespace = 'api';

      this.get(firstPaths.students, async (schema, request) => {
        const limit = request.queryParams.limit;
        const page = request.queryParams.page;
        let query = request.queryParams.query || '';

        const filterTable = schema.db.students.filter((student) => student.name.includes(query));

        if (typeof query === 'undefined' || query == '') {
          return schema.students.all();
        } else {
          return new Response(
            200,
            {},
            {
              filter: filterTable,
              limit: limit,
              page: page,
            }
          );
        }
      });

      this.post('/logout', () => {
        return new Response(
          200,
          {},
          {
            code: 0,
            msg: 'success',
            data: true,
          }
        );
      });

      this.post('/login', (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        const result = schema.users.where({
          email: attrs.email,
          password: attrs.password,
          type: attrs.loginType,
        });
        console.log(result);
        if (result.length > 0) {
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: 'success',
              data: {
                token: Math.random().toString(32).split('.')[1],
                loginType: attrs.loginType,
              },
            }
          );
        } else {
          return new Response(400, {}, { message: 'Please check your email or password' });
        }
      });
    },
  });
  return server;
}
