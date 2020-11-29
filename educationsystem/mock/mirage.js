// mirage.js
import { createServer, Model,Response } from "miragejs"

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
    },

    seeds(server) {
      server.create("user", { email: "student@gmail.com", password:"1234", loginType:'student'})
      server.create("user", { email: "teacher@gmail.com", password:"1234", loginType:'teacher'})
      server.create("user", { email: "manager@gmail.com", password:"1234", loginType:'manager'})
      server.create("user", { email: "admin@gmail.com", password:"1234", loginType:'manager'})
      server.db.loadData({
        studentInfo: [
          {
            "id" : 1,
            "name" : "admin",
            "type_id" : 2,
            "course_id_deleted" : 1,
            "update_date" : "2020-06-30 15:09:04",
            "password" : "123456",
            "address" : "新西兰",
            "ctime" : "2020-06-19 15:29:58",
            "email" : "student@admin.com"
          },
          {
            "id" : 53,
            "name" : "铁憨憨",
            "type_id" : 2,
            "course_id_deleted" : 1,
            "update_date" : "2020-06-30 15:01:37",
            "password" : "123456",
            "address" : "澳洲",
            "ctime" : "2020-06-19 15:29:58",
            "email" : "tiehaha@admin.com"
          },
          {
            "id" : 56,
            "name" : "green",
            "type_id" : 2,
            "course_id_deleted" : 1,
            "update_date" : "2020-03-18 02:10:19",
            "password" : "123456",
            "address" : "加拿大",
            "ctime" : "2020-06-19 15:29:58",
            "email" : "green@green.com"
          },
          {
            "id" : 62,
            "name" : "zaaa",
            "type_id" : 2,
            "course_id_deleted" : 31,
            "update_date" : "2020-03-20 21:38:44",
            "password" : "123456",
            "address" : "国内",
            "ctime" : "2020-06-19 15:29:58",
            "email" : "zaaa@admin.com"
          },
          {
            "id" : 73,
            "name" : "admin1",
            "type_id" : 2,
            "course_id_deleted" : 0,
            "update_date" : "2020-06-28 16:06:41",
            "password" : "123456",
            "address" : "dsd",
            "ctime" : "2020-06-28 16:06:41",
            "email" : "admin1@admin.com"
          },
          {
            "id" : 76,
            "name" : "abcde",
            "type_id" : 1,
            "course_id_deleted" : 0,
            "update_date" : "2020-07-05 13:29:41",
            "password" : "123456",
            "address" : "ds",
            "ctime" : "2020-07-05 13:29:41",
            "email" : "323@sd"
          },
          {
            "id" : 78,
            "name" : "admin14454",
            "type_id" : 1,
            "course_id_deleted" : 0,
            "update_date" : "2020-07-05 13:43:22",
            "password" : "123456",
            "address" : "3",
            "ctime" : "2020-07-05 13:43:22",
            "email" : "3@gmail.com"
          },
          {
            "id" : 79,
            "name" : "2",
            "type_id" : 1,
            "course_id_deleted" : 0,
            "update_date" : "2020-07-14 18:49:16",
            "password" : "123456",
            "address" : "12",
            "ctime" : "2020-07-06 20:03:22",
            "email" : "12@d"
          },
          {
            "id" : 80,
            "name" : "fdf",
            "type_id" : 2,
            "course_id_deleted" : 0,
            "update_date" : "2020-07-06 20:04:23",
            "password" : "123456",
            "address" : "dwd",
            "ctime" : "2020-07-06 20:04:23",
            "email" : "323@323fd"
          },
          {
            "id" : 81,
            "name" : "haha",
            "type_id" : 1,
            "course_id_deleted" : 0,
            "update_date" : "2020-07-07 19:09:53",
            "password" : "123456",
            "address" : "1",
            "ctime" : "2020-07-07 19:09:53",
            "email" : "12@sds"
          },
          {
            "id" : 82,
            "name" : "dsd",
            "type_id" : 1,
            "course_id_deleted" : 0,
            "update_date" : "2020-07-08 19:42:11",
            "password" : "123456",
            "address" : "sd",
            "ctime" : "2020-07-08 19:42:11",
            "email" : "sd@sdsd"
          },
          {
            "id" : 83,
            "name" : "323",
            "type_id" : 2,
            "course_id_deleted" : 0,
            "update_date" : "2020-07-14 18:47:54",
            "password" : "123456",
            "address" : "23",
            "ctime" : "2020-07-14 18:47:54",
            "email" : "323@232"
          },
          {
            "id" : 84,
            "name" : "Tramp",
            "type_id" : 1,
            "course_id_deleted" : 0,
            "update_date" : "2020-07-23 19:53:06",
            "password" : "123456",
            "address" : "Sydney",
            "ctime" : "2020-07-23 19:53:06",
            "email" : "2@sad.com"
          }
        ],
      })
    
    },

    routes() {
      this.passthrough((request) => {
        if (request.url === '/_next/static/development/_devPagesManifest.json')
            return true;
          });
          this.namespace = "api"
      this.get("/users", (schema) => {
        return schema.users.all()
      })

      this.get("/studentInfo", (schema, request) => {
        console.log(schema.db.studentInfo)
        return schema.db.studentInfo
      })
     
      this.post("/logout", ()=>{
        return new Response(
          200,
          {},
          {
            message:'logout'
          }
      )
      })
      
      this.post("/users", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        const result = schema.users.where({
          email:attrs.email,
          password:attrs.password,
          loginType:attrs.loginType,
        })
        if (result.length>0){
            return new Response(
                200,
                {},
                {
                token: Math.random().toString(32).split('.')[1], loginType:attrs.loginType
              }
            )
        }else{
          return new Response(
            400,
            {},
            {message:'Please check your email or password'}
          )
        }

      })
    },
  })
  return server
}
