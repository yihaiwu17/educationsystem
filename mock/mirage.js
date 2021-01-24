// mirage.js
import { format, subMonths } from 'date-fns';
import { countBy } from 'lodash';
import { belongsTo, createServer, hasMany, Model, Response } from 'miragejs';
import { firstPaths, secondPaths } from '../services/path';
const students = require('../mock/data/student.json');
const users = require('../mock/data/user.json');
const teachers = require('../mock/data/teacher.json');
const courseTypes = require('../mock/data/course_type.json');
const courses = require('../mock/data/course.json');
const studentCourses = require('../mock/data/student_course.json');
const studentTypes = require('../mock/data/student_type.json');
const studentProfiles = require('../mock/data/student_profile.json');
const sales = require('../mock/data/sales.json');
const schedules = require('../mock/data/schedule.json');
const teacherProfiles = require('./data/teacher_profile.json');

export function makeServer({ environment = 'test' } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      studentType: Model,
      student: Model.extend({
        studentCourses: hasMany(),
        type: belongsTo('studentType'),
        profile: belongsTo('studentProfile'),
      }),
      courseType: Model,
      teacherProfile: Model,
      teacher: Model.extend({
        profile: belongsTo('teacherProfile'),
      }),
      sale: Model,
      schedule: Model,
      course: Model.extend({
        teacher: belongsTo('teacher'),
        type: belongsTo('courseType'),
        sales: belongsTo('sale'),
        schedule: belongsTo('schedule'),
      }),
      studentCourse: Model.extend({
        course: belongsTo('course'),
      }),
      studentProfile: Model.extend({
        studentCourses: hasMany(),
        type: belongsTo('studentType'),
      }),
    },

    seeds(server) {
      users.forEach((user) => server.create('user', user));
      courseTypes.forEach((type) => server.create('courseType', type));
      teacherProfiles.forEach((teacher) => server.create('teacherProfile', teacher));
      teachers.forEach((teacher) => server.create('teacher', teacher));
      sales.forEach((sale) => server.create('sale', sale));
      schedules.forEach((schedule) => server.create('schedule', schedule));
      courses.forEach((course) => server.create('course', course));
      studentCourses.forEach((course) => server.create('studentCourse', course));
      studentTypes.forEach((type) => server.create('studentType', type));
      studentProfiles.forEach((profile) => server.create('studentProfile', profile));
      students.forEach((student) => server.create('student', student));
    },

    routes() {
      this.passthrough((request) => {
        if (
          request.url === '/_next/static/development/_devPagesManifest.json' ||
          request.url.includes('www.mocky.io') ||
          request.url.includes('amap') ||
          request.url.includes('highcharts') || 
          request.url.includes('dashboard') 
        )
          return true;
      });

      this.namespace = 'api';

      this.get('/course/code', (schema) => {
        const courseCode = Math.random().toString(32).split('.')[1];
        return new Response(
          200,
          {},
          {
            code: 0,
            msg: 'success',
            data: {
              courseCode,
            },
          }
        );
      });

      this.get('/course/type', (schema) => {
        const courseType = schema.courseTypes.all().models;
        return new Response(
          200,
          {},
          {
            code: 0,
            msg: 'success',
            data: {
              courseType,
            },
          }
        );
      });

      this.get('/teachers', (schema, request) => {
        const { query } = request.queryParams;
        const all = schema.teachers.all();
        let teacherInfo = all.filter((item) => !query || item.name.toLowerCase().includes(query))
          .models;
        console.log(teacherInfo);

        return new Response(
          200,
          {},
          {
            code: 0,
            msg: 'success',
            data: {
              teacherInfo,
            },
          }
        );
      });

      this.get('/course', (schema, request) => {
        const id = request.queryParams.id;
        let courseData = schema.courses.findBy({ id });
        courseData.attrs.sales = courseData.sales.attrs;
        courseData.attrs.teacherName = courseData.teacher.name;
        courseData.attrs.typeName = courseData.type.name;
        let schedules = courseData.schedule.attrs;

        if (courseData) {
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: 'success',
              data: {
                courseData,
              },
              schedule: {
                schedules,
              },
            }
          );
        }
      });

      this.get('/courses', (schema, request) => {
        const { page, limit, ...others } = request.queryParams;
        const courseResult = Object.entries(others).filter(([key, value]) => !!value);
        let courses = schema.courses.all().models;

        const total = courses.length;

        if (limit && page) {
          const start = limit * (page - 1);
          const next = limit * page;
          courses = courses.slice(start, next);
        }

        if (courseResult.length) {
          courses = courses.filter((item) =>
            courseResult.every(([key, value]) => {
              if (key === 'name') {
                return item.name.includes(value);
              } else if (key === 'type') {
                return item.type.name.toLowerCase() === value.toLowerCase();
              } else {
                return item[key].toLowerCase() === value.toLowerCase();
              }
            })
          );
        }

        courses.forEach((item) => {
          item.attrs.teacherName = item.teacher.name;
          item.attrs.typeName = item.type.name;
        });

        if (courses) {
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: 'success',
              data: {
                courses,
                total,
              },
            }
          );
        }
      });

      this.post('/courses/add', (schema, req) => {
        const body = JSON.parse(req.requestBody);
        const {
          name,
          uid,
          cover,
          detail,
          duration,
          maxStudents,
          price,
          startTime,
          typeId,
          durationUnit,
          teacherId,
        } = body;
        const schedule = schema.schedules.create({
          status: 0,
          current: 0,
          classTime: null,
          chapters: null,
        });

        const sales = schema.sales.create({
          batches: 0,
          price,
          earnings: 0,
          paidAmount: 0,
          studentAmount: 0,
          paidIds: [],
        });

        const data = schema.db.courses.insert({
          name,
          uid,
          detail,
          startTime,
          price,
          maxStudents,
          sales,
          schedule,
          star: 0,
          status: 0,
          duration,
          durationUnit,
          cover,
          teacherId,
          typeId,
          ctime: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        });

        data.typeName = schema.courseTypes.findBy({ id: typeId }).name;
        data.scheduleId = schedule.id;
        console.log(data);

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/courses/update', (schema, req) => {
        const { id, ...others } = JSON.parse(req.requestBody);
        const target = schema.courses.findBy({ id });

        if (target) {
          const data = target.update({
            ...others,
          });

          data.attrs.typeName = data.type.name;

          return new Response(200, {}, { msg: 'success', code: 200, data });
        } else {
          return new Response(400, {}, { msg: `can\'t find course by id ${id} `, code: 400 });
        }
      });

      this.get('/courses/schedules', (schema, req) => {
        const id = req.queryParams.id;
        const data = schema.schedules.findBy({ id });
        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/courses/schedules', (schema, req) => {
        const body = JSON.parse(req.requestBody);
        const { scheduleId, courseId } = body;
        let target;

        if (!!scheduleId || !!courseId) {
          if (scheduleId) {
            target = schema.schedules.findBy({ id: scheduleId });
            console.log(target);
          } else {
            target = schema.courses.findBy({ id: courseId }).schedule;
            console.log(target);
          }
          const { classTime, chapters } = body;

          target.update({
            current: 0,
            status: 0,
            chapters: chapters.map((item, index) => ({ ...item, id: index })),
            classTime,
          });
          console.log('target', target);
          return new Response(200, {}, { msg: 'success', code: 200, data: true });
        } else {
          return new Response(
            400,
            {},
            {
              msg: `can\'t find process by course ${courseId} or scheduleId ${scheduleId} `,
              code: 400,
            }
          );
        }
      });
      this.get('/students', (schema, request) => {
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

      this.get('/student', (schema, request) => {
        const id = request.queryParams.id;
        const student = schema.studentProfiles.findBy({ id });
        const studentCourses = student.studentCourses;
        let courses = [];

        if (studentCourses.length) {
          studentCourses.models.map((item) => {
            const name = item.course.name;
            const type = item.course.type.name;
            const ctime = item.course.ctime;
            courses.push({ name, type, ctime });
          });
        }
        student.attrs.courses = courses;
        student.attrs.typeName = student.type.name;

        if (student) {
          return new Response(
            200,
            {},
            {
              code: 0,
              msg: 'success',
              data: {
                student,
              },
            }
          );
        }
      });

      this.post(firstPaths.students + '/' + secondPaths.add, (schema, req) => {
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

      this.post(firstPaths.students + '/' + secondPaths.update, (schema, req) => {
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

      this.get('/statistics/overview', (schema, req) => {
        const courses = schema.courses.all().models;
        const data = {
          student: getPeopleStatistics(schema, 'students'),
          teacher: getPeopleStatistics(schema, 'teachers'),
          course: {
            total: courses.length,
            lastMonthAdded: schema.courses.where(
              (item) => new Date(item.ctime) >= subMonths(new Date(), 1)
            ).models.length,
          },
        };
        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.get('/statistics/student', (schema, req) => {
        const source = schema.students.all().models;
        const data = {
          area: getStatisticList(countBy(source,'area')),
          typeName: getStatisticList(countBy(source,(item)=>item.type.name)),
          ctime: getCtimeStatistics(source),
        }
        return new Response(200, {}, { msg: 'success', code: 200, data });
      });


      this.get('/statistics/teacher', (schema, req) => {
        const source = schema.teachers.all().models;
        console.log(source)
        const data = {
          country: getStatisticList(countBy(source,'country')),
          ctime: getCtimeStatistics(source),
        }
        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.get('/statistics/course', (schema, req) => {
        const source = schema.courses.all().models;
        const data = {
          typeName: getStatisticList(countBy(source,(item)=>item.type.name)),
          ctime: getCtimeStatistics(source),
        }
        return new Response(200, {}, { msg: 'success', code: 200, data });
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

function getPeopleStatistics(schema, type) {
  const all = schema[type].all().models;
  const male = all.filter((item) => item.profile?.gender === 1).length;
  const female = all.filter((item) => item.profile?.gender === 2).length;
  if (type === 'teachers') {
    return {
      total: all.length,
      lastMonthAdded: schema.teachers.where(
        (item) => new Date(item.ctime) >= subMonths(new Date(), 1)
      ).models.length,
      gender: { male, female, unknown: all.length - male - female },
    };
  } else {
    return {
      total: all.length,
      lastMonthAdded: schema.students.where(
        (item) => new Date(item.ctime) >= subMonths(new Date(), 1)
      ).models.length,
      gender: { male, female, unknown: all.length - male - female },
    };
  }
}

function getStatisticList(obj){
  return Object.entries(obj).map(([name,amount]) => ({name, amount}))
}

function getCtimeStatistics(source){
  const ctimeValue = getStatisticList(countBy(source,(item)=>{
    const index = item.ctime.lastIndexOf('-')
      return item.ctime.slice(0,index)
  }))
    return ctimeValue
}