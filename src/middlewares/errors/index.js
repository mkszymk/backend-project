import EErrors from "../../services/errors/enums.js";

const errorMiddleware = (err, req, res, next) => {
  console.log("---------------------------------------");
  console.log(err.cause);
  switch (err.code) {
    case EErrors.MISSING_ARGUMENT_ERROR:
      res.send({ status: "error", error: err.name });
      break;
    default:
      res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};

export default errorMiddleware;
