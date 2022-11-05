const databaseUtil = require("../database");

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        studentId,
        firstName,
        lastName,
        nickName,
        dataConsent,
        photoConsent,
      } = req.body;

      databaseUtil.create(
        studentId,
        firstName,
        lastName,
        nickName,
        dataConsent,
        photoConsent
      );

      // Get User Info
      const users = databaseUtil.timeStampStudent(studentId);

      res.status(200).send({
        registerCode: `ISAG_1ST_FIRST:${studentId}:${users.timestamp}`,
      });
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
        next({
          statusCode: 400,
          cusMessage: "duplicate studentId",
          status: "fail",
        });
      } else if (error.message === "Out of ticket") {
        next({
          statusCode: 400,
          cusMessage: "Out of ticket",
          status: "fail",
        });
      } else {
        next(error);
      }
    }
  },
  createPremium: async (req, res, next) => {
    try {
      const {
        studentId,
        firstName,
        lastName,
        nickName,
        dataConsent,
        photoConsent,
      } = req.body;

      databaseUtil.createPremium(
        studentId,
        firstName,
        lastName,
        nickName,
        dataConsent,
        photoConsent
      );

      // Get User Info
      const users = databaseUtil.timeStampStudent(studentId);

      res.status(200).send({
        registerCode: `ISAG_1ST_FIRST:${studentId}:${users.timestamp}`,
      });
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
        next({
          statusCode: 400,
          cusMessage: "duplicate studentId",
          status: "fail",
        });
      } else if (error.message === "Out of ticket") {
        next({
          statusCode: 400,
          cusMessage: "Out of ticket",
          status: "fail",
        });
      } else {
        next(error);
      }
    }
  },
  list: async (req, res, next) => {
    try {
      const users = databaseUtil.list();
      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const { studentID } = req.body;
      const users = databaseUtil.get(studentID);
      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  },
  checkIn: async (req, res, next) => {
    try {
      const { studentId } = req.body;
      const student = databaseUtil.checkIn(studentId);
      if (student == undefined) {
        res.status(400).send({ message: "This student doesn't registered" });
      }
      res.status(200).send({
        student: student,
      });
    } catch (error) {
      next(error);
    }
  },
  ticketLeft: async (req, res, next) => {
    try {
      const row = databaseUtil.ticketLeft();
      res.status(200).send({
        ticketLeft: row,
      });
    } catch (error) {
      next(error);
    }
  },
  timeStamp: async (req, res, next) => {
    try {
      const { studentId } = req.body;
      const users = databaseUtil.timeStampStudent(studentId);
      // Warning!
      res.status(200).send({ timestamp: `${studentId}_${users.timestamp}` });
    } catch (error) {
      next(error);
    }
  },
  registerParticipant: async (req, res, next) => {
    try {
      const member = databaseUtil.allRegisterParticipant();
      res.status(200).send(member);
    } catch (error) {
      next(error);
    }
  },
  checkOut: async (req, res, next) => {
    try {
      const { studentId } = req.body;
      const student = databaseUtil.checkOut(studentId);
      if (student == undefined) {
        res.status(400).send({ message: "This student doesn't registered" });
      }
      res.status(200).send({
        student: student,
      });
    } catch (error) {
      next(error);
    }
  },
};
