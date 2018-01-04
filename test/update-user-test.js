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

describe('Test Update User', function () {
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

  it('should 404 on updating non-existing user on /user/update/<unknown_id> POST',
      function (done) {
        delete validUser.id;

        chai.request(server)
        .post('/user/update/random')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(404);
          done();
        });
      });

  it('should reject updating existing user with unknown attribute(id) on /user/update/<existing_id> POST',
      function (done) {
        chai.request(server)
        .post('/user/update/' + validUser.id)
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });

  it("should update existing user's email on /user/update/<existing_id> POST",
      function (done) {
        var sinceTestStarted = new Date();

        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(201);

          var updatedEmail = 'renyankai532@hotamil.com';

          chai.request(server)
          .post('/user/update/' + validUser.id)
          .send({email: updatedEmail})
          .end(function (err, res) {
            res.should.have.status(204);

            chai.request(server)
            .get('/user/' + validUser.id)
            .end(function (error, response) {
              validUser.email = updatedEmail;

              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.should.have.property('forename');
              response.body.should.have.property('surname');
              response.body.should.have.property('created');
              response.body.should.excluding(['created']).be.deep.equal(
                  validUser);
              response.body.created.should.be.a.dateString();
              var tillNow = new Date();
              new Date(response.body.created).should.be.withinDate(
                  sinceTestStarted, tillNow);

              done();
            });
          });
        });
      });

  it("should update existing user's forename on /user/update/<existing_id> POST",
      function (done) {
        var sinceTestStarted = new Date();

        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(201);

          var updatedForename = 'Yankai';

          chai.request(server)
          .post('/user/update/' + validUser.id)
          .send({forename: updatedForename})
          .end(function (err, res) {
            res.should.have.status(204);

            chai.request(server)
            .get('/user/' + validUser.id)
            .end(function (error, response) {
              validUser.forename = updatedForename;

              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.should.have.property('forename');
              response.body.should.have.property('surname');
              response.body.should.have.property('created');
              response.body.should.excluding(['created']).be.deep.equal(
                  validUser);
              response.body.created.should.be.a.dateString();
              var tillNow = new Date();
              new Date(response.body.created).should.be.withinDate(
                  sinceTestStarted, tillNow);

              done();
            });
          });
        });
      });

  it("should update existing user's surname on /user/update/<existing_id> POST",
      function (done) {
        var sinceTestStarted = new Date();

        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(201);

          var updatedSurname = 'Ren';

          chai.request(server)
          .post('/user/update/' + validUser.id)
          .send({surname: updatedSurname})
          .end(function (err, res) {
            res.should.have.status(204);

            chai.request(server)
            .get('/user/' + validUser.id)
            .end(function (error, response) {
              validUser.surname = updatedSurname;

              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.should.have.property('forename');
              response.body.should.have.property('surname');
              response.body.should.have.property('created');
              response.body.should.excluding(['created']).be.deep.equal(
                  validUser);
              response.body.created.should.be.a.dateString();
              var tillNow = new Date();
              new Date(response.body.created).should.be.withinDate(
                  sinceTestStarted, tillNow);

              done();
            });
          });
        });
      });

  it("should update existing user's email, forename and surname on /user/update/<existing_id> POST",
      function (done) {
        var sinceTestStarted = new Date();

        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(201);

          var updatedEmail = 'renyankai532@hotmail.com';
          var updatedForename = 'Yankai';
          var updatedSurname = 'Ren';

          chai.request(server)
          .post('/user/update/' + validUser.id)
          .send({
            email: updatedEmail,
            forename: updatedForename,
            surname: updatedSurname
          })
          .end(function (err, res) {
            res.should.have.status(204);

            chai.request(server)
            .get('/user/' + validUser.id)
            .end(function (error, response) {
              validUser.email = updatedEmail;
              validUser.forename = updatedForename;
              validUser.surname = updatedSurname;

              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.should.have.property('forename');
              response.body.should.have.property('surname');
              response.body.should.have.property('created');
              response.body.should.excluding(['created']).be.deep.equal(
                  validUser);
              response.body.created.should.be.a.dateString();
              var tillNow = new Date();
              new Date(response.body.created).should.be.withinDate(
                  sinceTestStarted, tillNow);

              done();
            });
          });
        });
      });
});