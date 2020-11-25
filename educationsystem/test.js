import { startMirage } from "./mirage"
import { Response } from "miragejs"

describe("homepage", function () {
  let server

  beforeEach(() => {
    server = startMirage()
  })

  afterEach(() => {
    server.shutdown()
  })

  it("shows an error if the server is down", function () {
    // Override the existing /movies route handler, just for this test
    server.get("/movies", () => new Response(500))

    cy.visit("/")

    cy.get("h1").should("contain", "Whoops! Our site is down.")
  })
})