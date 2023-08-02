import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { fakerES as faker } from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export default __dirname;

export const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.url({ height: 100, width: 100 }),
    code: faker.string.alphanumeric(6),
    stock: faker.number.int({ min: 1, max: 60 }),
    status: faker.datatype.boolean({ probability: 0.8 }),
    category: faker.commerce.department(),
    _id: faker.database.mongodbObjectId(),
  };
};
