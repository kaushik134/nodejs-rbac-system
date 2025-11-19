const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "User-Role Management API",
            version: "1.0.0",
            description: "Backend service for managing users, roles, and role-based access control (RBAC) using Node.js, Express, and MongoDB.",
        },
        servers: [
            {
                url: `${process.env.SERVER_URL || "http://localhost:8000"}/api`,
                description: "Main API Server",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },

    apis: ["./src/routes/*.js", "./src/controllers/*.js", "./src/docs/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    serveSwagger: swaggerUi.serve,
    setupSwagger: swaggerUi.setup(swaggerSpec),
};
