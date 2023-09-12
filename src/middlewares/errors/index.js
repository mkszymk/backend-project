import EErrors from "../../services/errors/enums.js";
import { loggerOutput } from "../../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  loggerOutput("error", `[Error Middleware] Cause: ${err.cause}`);
  switch (err.code) {
    case EErrors.MISSING_ARGUMENT_ERROR:
      res.status(500).send({ status: "error", error: err.name });
      break;
    default:
      res
        .status(500)
        .send({ status: "error", error: "Unhandled error", info: err });
      break;
  }
};

export default errorMiddleware;
