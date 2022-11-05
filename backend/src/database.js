const sqlite3 = require("better-sqlite3");
const crypto = require("crypto");
const path = require("path");

const { SECRET_MD5 } = require("./config");

const db = new sqlite3(path.resolve(__dirname, "./database.db"), {});

// initial Table
(() => {
  try {
    db.exec(
      `CREATE TABLE IF NOT EXISTS Users (
        student_id CHAR(255) PRIMARY KEY ,
        first_name CHAR(255), 
        last_name CHAR(255), 
        check_in INTEGER,
        nick_name CHAR(255),
        data_consent INTEGER,
        photo_consent INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
  } catch (error) {
    console.log("Task table exist, skip create.");
  }
})();

module.exports = {
  create(studentID, firstName, lastName, nickName, dataConsent, photoConsent) {
    const ticketLeft = this.ticketLeft();
    if (ticketLeft <= 0) {
      throw new Error("Out of ticket");
    }

    const User = db.prepare(
      `INSERT INTO Users (
              student_id,
              first_name,
              last_name,
              check_in,
              nick_name,
              data_consent,
              photo_consent
            ) VALUES (
              @studentID,
              @firstName,
              @lastName,
              @checkIn,
              @nickName,
              @dataConsent,
              @photoConsent
            )`
    );

    return User.run({
      studentID,
      firstName,
      lastName,
      checkIn: 0,
      nickName,
      dataConsent,
      photoConsent,
    });
  },
  createPremium(
    studentID,
    firstName,
    lastName,
    nickName,
    dataConsent,
    photoConsent
  ) {
    const User = db.prepare(
      `INSERT INTO Users (
              student_id,
              first_name,
              last_name,
              check_in,
              nick_name,
              data_consent,
              photo_consent
            ) VALUES (
              @studentID,
              @firstName,
              @lastName,
              @checkIn,
              @nickName,
              @dataConsent,
              @photoConsent
            )`
    );

    return User.run({
      studentID,
      firstName,
      lastName,
      checkIn: 0,
      nickName,
      dataConsent,
      photoConsent,
    });
  },
  checkIn(studentId) {
    const updateUser = db.prepare(
      "UPDATE Users SET check_in=1 WHERE student_id=?"
    );
    const student = db.prepare("SELECT * FROM Users WHERE student_id=?");
    updateUser.run([studentId]);
    return student.get([studentId]);
  },
  checkOut(studentId) {
    const updateUser = db.prepare(
      "UPDATE Users SET check_in=0 WHERE student_id=?"
    );
    const student = db.prepare("SELECT * FROM Users WHERE student_id=?");
    updateUser.run([studentId]);
    return student.get([studentId]);
  },
  list() {
    const Users = db.prepare(`
				SELECT * FROM Users 
				LIMIT ?,? 
				`);

    let users = Users.all([0, 500]);
    users = users.sort(
      (a, b) => b.check_in - a.check_in || a.student_id - b.student_id
    );
    return users;
  },
  get(studentId) {
    const student = db.prepare("SELECT * FROM Users WHERE student_id=?");
    return student.get([studentId]);
  },
  ticketLeft() {
    const rowNum = db.prepare(`
      SELECT COUNT(*) as student_id FROM Users
    `);
    return 60 - rowNum.get().student_id;
  },
  timeStampStudent(studentId) {
    const findUser = db.prepare(
      "SELECT timestamp, student_id FROM Users WHERE student_id=?"
    );

    const user = findUser.get([studentId]);

    // Copy from Get Started!
    const md5Hasher = crypto.createHmac("md5", SECRET_MD5);
    const hash = md5Hasher
      .update(user.timestamp + "_" + user.student_id)
      .digest("hex");

    return { timestamp: hash };
  },
  allRegisterParticipant() {
    const member = db.prepare(
      `SELECT COUNT(*) as check_in FROM Users WHERE check_in=1`
    );
    return member.get();
  },
};
