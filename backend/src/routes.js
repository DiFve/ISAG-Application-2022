const hcaptcha = require("express-hcaptcha");

const { isAdmin } = require("./auth");
const users = require("./controller/users");
const { HCAPTCHA_SECRET } = require("./config");

module.exports = (app) => {
  // Using middleware validation
  app.post(
    "/api/v341/register",
    hcaptcha.middleware.validate(HCAPTCHA_SECRET),
    users.create
  );
  // app.post('/api/v341/register', users.create);

  // Public API
  app.post("/api/v341/ticket-left", users.ticketLeft);
  app.post("/api/v341/timestamp", users.timeStamp);

  // Private API!!!
  // Serve Sensitive information
  app.post("/api/kanokporn_swha/list", isAdmin, users.list);
  app.post("/api/kanokporn_swha/create", isAdmin, users.createPremium);
  app.post("/api/kanokporn_swha/check-in", isAdmin, users.checkIn);
  app.post("/api/kanokporn_swha/check-out", isAdmin, users.checkOut);
  app.post("/api/kanokporn_swha/get", isAdmin, users.get);
  app.post("/api/kanokporn_swha/auth", isAdmin, (req, res, next) => {
    res.status(200).send({ message: "Your ISAG." });
  });
  app.get(
    "/api/kanokporn_swha/register_participant",
    isAdmin,
    users.registerParticipant
  );
};
