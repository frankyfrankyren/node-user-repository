process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiExclude = require('chai-exclude');
var chaiDateTime = require('chai-datetime');
var chaiDateString = require('chai-date-string');
var chaiSubset = require('chai-subset');

var server = require('../app');

var database = server.userRepo.database;
chai.should();
chai.use(chaiHttp);
chai.use(chaiExclude);
chai.use(chaiDateTime);
chai.use(chaiDateString);
chai.use(chaiSubset);

var validUser;
var validUser2;

describe('Retrieving All User Details', function () {

  beforeEach(function (done) {
    validUser = {
      id: '123',
      email: 'test@hotmail.com',
      forename: 'Frank',
      surname: 'Cervany'
    };

    validUser2 = {
      id: '456',
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

  it('should return empty array when there are no users on /users GET',
      function (done) {
        chai.request(server)
        .get('/users')
        .end(function (err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.instanceOf(Array);
          res.body.should.be.empty;
          done();
        });
      });

  it('should return inserted users on /users GET', function (done) {
    var sinceTestStarted = new Date();

    chai.request(server)
    .post('/user/create')
    .send(validUser)
    .end(function (err1, res1) {
      res1.should.have.status(201);

      chai.request(server)
      .post('/user/create')
      .send(validUser2)
      .end(function (err2, res2) {
        res2.should.have.status(201);

        chai.request(server)
        .get('/users')
        .end(function (error, response) {
          var tillNow = new Date();

          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.instanceOf(Array);
          response.body.should.have.length(2);
          response.body.should.containSubset([validUser, validUser2]);
          response.body[0].created.should.be.a.dateString();
          response.body[1].created.should.be.a.dateString();
          new Date(response.body[0].created).should.be.withinDate(
              sinceTestStarted, tillNow);
          new Date(response.body[1].created).should.be.withinDate(
              sinceTestStarted, tillNow);

          done();
        });
      });
    });
  });
});