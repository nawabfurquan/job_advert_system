import swaggerJSDoc from "swagger-jsdoc";

// Swagger setup
const swaggerDef = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JobHub API",
      version: "1.0.0",
      description: "",
    },
  },
};

const options = {
  ...swaggerDef,
  apis: ["./routes/*.js", "./parameters.yaml"],
};

export const swaggerSpec = swaggerJSDoc(options);
