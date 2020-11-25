// mirage.js
import { createServer, Model } from "miragejs"

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
    },

    seeds(server) {
      server.create("user", { email: "leo@gmail.com", password:"1234" })
      server.create("user", { email: "wang@gmail.com", password:"1234" })
      server.create("user", { email: "wu@gmail.com", password:"1234" })
      server.create("user", { email: "admin@gmail.com", password:"1234" })
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
        console.log("1"+schema.users.findBy({email:attrs.email}))
        console.log(attrs.email)
        if (attrs.email === schema.users.email && attrs.password === schema.users.password){
            console.log('true')
        }

      })
    },
        
  })

  return server
}
