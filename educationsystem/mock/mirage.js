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
      
      this.post("/users", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        const result = schema.users.where({
          email:attrs.email,
          password:attrs.password,
          loginType:attrs.loginType,
        })
        console.log(attrs.email,attrs.password)
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
