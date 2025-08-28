class ResponseHandler {
  constructor(res) {
    this.res = res;
  }

  success(data, message = "Success", statusCode = 200) {
    this.res.status(statusCode).json({
      success: true,
      status: statusCode,
      message,
      data,
    });
  }

  error(message = "An error occurred", statusCode = 500, errorDetails = null) {
    this.res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
      error: errorDetails,
    });
  }

  notFound(message = "Resource not found") {
     this.res.status(404).json({
      success: false,
      message,
    });
  }

  validationError(errors) {
     this.res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }
  authorizathionError(message) {
     this.res.status(401).json({
      success: false,
      message,
    });
  }


}

module.exports = ResponseHandler;
