process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiExclude = require('chai-exclude');
var chaiDateTime = require('chai-datetime');
var chaiDateString = require('chai-date-string');

var server = require('../app');
var database = server.userRepo.database;

chai.should();
chai.use(chaiHttp);
chai.use(chaiExclude);
chai.use(chaiDateTime);
chai.use(chaiDateString);

var assert = chai.assert;
var validUser;

describe('Test Saving User', function () {
  function verifyFollowingRecordExists(user, createdTimeFrom, createdTimeTo) {
    assert(user, 'Attempting to verify the existence of null or undefined');
    database.findOne({_id: user['id']}, function (err, doc) {
      if (err) {
        throw err;
      }

      doc.should.excluding(['_id', 'id', 'created']).to.deep.equal(user);
      doc._id.should.equal(user.id);
      doc.created.should.be.withinDate(createdTimeFrom, createdTimeTo);
    })
  }

  beforeEach(function (done) {
    validUser = {
      id: '123',
      email: 'test@hotmail.com',
      forename: 'Frank',
      surname: 'Cervany'
    };

    database.remove({}, {multi: true}, function (err) {
      if (err) {
        throw new Error("Failed to clear nedb");
      }
      done();
    })
  });

  it('should reject saving users without id on /user/create POST',
      function (done) {
        delete validUser.id;

        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });

  it('should reject saving users without email on /user/create POST',
      function (done) {
        delete validUser.email;

        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });

  it('should reject saving users without forename on /user/create POST',
      function (done) {
        delete validUser.forename;

        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });

  it('should reject saving users without surname on /user/create POST',
      function (done) {
        delete validUser.surname;

        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });

  it('should reject saving users with unknown fields on /user/create POST',
      function (done) {
        validUser.comment = 'heydude';

        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });

  it('should save user with new id on /user/create POST', function (done) {
    var sinceTestStarted = new Date();

    chai.request(server)
    .post('/user/create')
    .send(validUser)
    .end(function (err, res) {
      res.should.have.status(201);
      var tillNow = new Date();
      verifyFollowingRecordExists(validUser, sinceTestStarted, tillNow);
      done();
    });
  });

  it('should indicate conflict and not save users with existing id on /user/create POST',
      function (done) {
        var sinceTestStarted = new Date();

        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(201);
          var tillNow = new Date();
          verifyFollowingRecordExists(validUser, sinceTestStarted, tillNow);

          chai.request(server)
          .post('/user/create')
          .send(validUser)
          .end(function (err2, res2) {
            res2.should.have.status(409);
            verifyFollowingRecordExists(validUser, sinceTestStarted, tillNow);
            done();
          });
        });
      });
});