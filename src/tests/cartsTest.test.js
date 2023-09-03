import chai from "chai";
import mongoose from "mongoose";
import { cartsService } from "../repositories/index.js";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de Carts Service", () => {
  it("Debe retornar un cart a partir de su ID", async function () {
    const mockId = new mongoose.Types.ObjectId("64e524ebfaea3498aeba4313");
    const payload = await cartsService.getCartById(mockId);
    expect(payload._id).to.be.deep.equal(mockId);
  });

  it("Debe agregar un nuevo carrito a la DB", async () => {
    const result = await cartsService.addCart();
    expect(result.success).to.be.deep.equal(true);
  });

  it("El servidor debe devolver error 401 - Request sin token", async () => {
    const response = await requester.get("/api/carts/0");
    expect(response.status).to.be.deep.equal(401);
  });
});
