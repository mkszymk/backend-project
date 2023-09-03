import chai from "chai";
import mongoose from "mongoose";
import { productsService } from "../repositories/index.js";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de Products Service", () => {
  it("Debe retornar un producto a partir de su ID", async function () {
    const mockId = new mongoose.Types.ObjectId("646ab458be264a5fee42fe20");
    const { payload } = await productsService.getProductById(mockId);
    expect(payload._id).to.be.deep.equal(mockId);
  });

  it("Debe retornar la lista de productos en la DB", async function () {
    const { payload } = await productsService.getProducts(9999, 1);
    expect(payload.length).to.be.greaterThanOrEqual(1);
  });

  it("El servidor debe devolver error 401 - Request sin token", async () => {
    const response = await requester.get("/api/products/0");
    expect(response.status).to.be.deep.equal(401);
  });
});
