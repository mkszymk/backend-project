import EErrors from "../../services/errors/enums.js";

const errorMiddleware = (error, req, res, next) => {
  console.log("---------------------------------------");
  console.log(error.cause);
  switch (error.code) {
    case EErrors.MISSING_ARGUMENT_ERROR:
      res.send({ status: "error", error: error.name });
      break;
    default:
      res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};

export default errorMiddleware;
