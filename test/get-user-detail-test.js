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

var validUser;

describe('Retrieving User Details', function () {
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

  it('should return 404 notfound on /user/<not_present_id> GET',
      function (done) {
        chai.request(server)
        .get('/user/random')
        .end(function (err, res) {
          res.should.have.status(404);
          done();
        });
      });

  it('should return inserted user on /user/<id> GET', function (done) {
    var sinceTestStarted = new Date();

    chai.request(server)
    .post('/user/create')
    .send(validUser)
    .end(function (err, res) {
      res.should.have.status(201);

      chai.request(server)
      .get('/user/' + validUser.id)
      .end(function (error, response) {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.should.have.property('forename');
        response.body.should.have.property('surname');
        response.body.should.have.property('created');
        response.body.should.excluding(['created']).be.deep.equal(validUser);
        response.body.created.should.be.a.dateString();
        var tillNow = new Date();
        new Date(response.body.created).should.be.withinDate(
            sinceTestStarted, tillNow);

        done();
      });
    });
  });
});