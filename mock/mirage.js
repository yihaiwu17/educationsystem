// mirage.js
import { belongsTo, createServer, Factory, hasMany, Model, Response, Server } from 'miragejs';
import { firstPaths, secondPaths } from '../services/path';
const students = require('../mock/data/student.json');
const users = require('../mock/data/user.json');
const courseTypes = require('../mock/data/course_type.json');
const courses = require('../mock/data/course.json');
const studentCourses = require('../mock/data/student_course.json');
const studentTypes = require('../mock/data/student_type.json');

export function makeServer({ environment = 'test' } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      studentType: Model,
      student: Model.extend({
        studentCourses: hasMany(),
        type: belongsTo('studentType'),
      }),
      courseType: Model,
      course: Model,
      studentCourse: Model.extend({
        course: belongsTo(),
      }),
    },

    seeds(server) {
      users.forEach((user) => server.create('user', user));
      courseTypes.forEach((type) => server.create('courseType', type));
      courses.forEach((course) => server.create('course', course));
      studentCourses.forEach((course) => server.create('studentCourse', course));
      studentTypes.forEach((type) => server.create('studentType', type));
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
        const { query } = request.queryParams;
        const all = schema.students.all();
        let studentInfo = all.filter((item) => !query || item.name.includes(query)).models;
        const total = !query ? all.length : studentInfo.length;
        let data = { total, studentInfo };
        if (limit && page) {
          const start = limit * (page - 1);
          studentInfo = studentInfo.slice(start, start + limit);
          data = { ...data, paginator: { limit, page, total } };
        }

        studentInfo = studentInfo.map((student) => {
          const studentCourses = student.studentCourses;
          let courses = [];

          if (studentCourses.length) {
            courses = studentCourses.models.map((model) => {
              const name = model.course.name;

              return { name, id: model.id };
            });
          }

          student.attrs.courses = courses;
          student.attrs.typeName = student.type.name;
          return student;
        });

        return new Response(
          200,
          {},
          {
            code: 0,
            msg: 'success',
            data: {
              ...data,
              studentInfo,
            },
          }
        );
      });

      this.post(firstPaths.students + '/' + secondPaths.add, (schema, request) => {
        const body = JSON.parse(req.requestBody);
        const { name, email, area, type } = body;
        const data = schema.students.create({
          name,
          email,
          area,
          typeId: type,
          ctime: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        });

        data.attrs.typeName = data.type.name;

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post(firstPaths.students+'/'+secondPaths.update, (schema, req) => {
        const { id, email, name, area, type } = JSON.parse(req.requestBody);
        const target = schema.students.findBy({ id });

        if (target) {
          const data = target.update({
            email,
            name,
            area,
            typeId: type,
            updateAt: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          });

          data.attrs.typeName = data.type.name;

          return new Response(200, {}, { msg: 'success', code: 200, data });
        } else {
          return new Response(400, {}, { msg: `can\'t find student by id ${id} `, code: 400 });
        }
      });

      this.delete(firstPaths.students + '/' + secondPaths.delete, (schema, request) => {
        const id = request.queryParams.id;
        schema.students.find(id).destroy();
        return new Response(200, {}, { code: 0, msg: 'success', data: true });
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
