import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cinema Booking API",
      version: "1.0.0",
      description: "API documentation for Cinema Ticket Booking System",
      contact: {
        name: "API Support",
        email: "support@cinema.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
    },
    tags: [
      { name: "Authentication", description: "Authentication endpoints" },
      { name: "Movies", description: "Movie management" },
      { name: "Schedules", description: "Schedule management" },
      { name: "Bookings", description: "Booking management" },
      { name: "Theaters", description: "Theater management" },
      { name: "Genres", description: "Genre management" },
      { name: "Reviews", description: "Review management" },
      { name: "Users", description: "User management" },
      { name: "Products", description: "Product management" },
      { name: "Vouchers", description: "Voucher management" },
      { name: "Payment", description: "Payment processing" },
      { name: "Upload", description: "File upload" },
      { name: "Admin", description: "Admin operations" },
    ],
  },
  apis: ["./src/docs/*.swagger.js"],
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
