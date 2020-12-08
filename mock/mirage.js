// mirage.js
import { createServer, Model, Response, Server } from 'miragejs';
import { firstPaths } from '../services/path';
const students = require('../mock/data/student.json');
const users = require('../mock/data/user.json');

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

      this.get(firstPaths.students, (schema, request) => {
        const limit = request.queryParams.limit;
        const page = request.queryParams.page;
        const { query } = req.queryParams;
        let students = schema.db.students.filter((student) => student.name.includes(query));
        
        const start = limit * (page - 1)
        const total = !query ? all.length : students.length;

        let data = { total, students };

        
        if (typeof query === 'undefined' || query === '') {
          students =students.slice(start, start + limit)
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: 'success',
              data:{
                ...data,
                paginator: { limit, page, total }, 
                students
              } 
            }
          );
        } else {
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: 'success',
              data:{
                students:students,
                total:limit,
                paginator:{
                  limit,
                  page,
                  total: filterTable.length
                }
              } 
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
