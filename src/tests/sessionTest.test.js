import chai from "chai";
import supertest from "supertest";
import { usersModel } from "../dao/models/user.model.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de Session Service", () => {
  before(async function () {
    if (await usersModel.findOne({ email: "emailtest@testmailjohndoe.net" }))
      return usersModel.deleteOne({ email: "emailtest@testmailjohndoe.net" });
  });
  it("Debe registrar un nuevo usuario correctamente", async function () {
    const mockUser = {
      name: "John",
      lastName: "Doe",
      email: "emailtest@testmailjohndoe.net",
      age: 30,
      password: "123456",
    };
    const response = await requester
      .post("/api/sessions/register")
      .send(mockUser);
    expect(response._body.success).to.be.deep.equal(true);
  });

  it("Debe retornar error 404 ya que no hay ningun user logeado", async function () {
    const response = await requester.get("/api/sessions/current");
    expect(response.status).to.be.deep.equal(404);
  });

  it("Debe logear correctamente a un usuario y devolver una cookie", async function () {
    const mockUser = {
      email: "test@testcoderhouse.com",
      password: "987654",
    };

    const result = await requester.post("/login").send(mockUser);
    const cookieResult = result.headers["set-cookie"][0];
    expect(cookieResult).to.be.ok;
    const cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };
    expect(cookie.name).to.be.ok.and.eql("authToken");
    expect(cookie.value).to.be.ok;
  });
});
