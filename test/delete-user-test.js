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

describe('Test Delete User', function () {
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

  it('should 404 on deleting non-existing user on /user/<unknown_id> DELETE',
      function (done) {
        delete validUser.id;

        chai.request(server)
        .delete('/user/random')
        .send(validUser)
        .end(function (err, res) {
          res.should.have.status(404);
          done();
        });
      });

  it('should remove user on /user/<unknown_id> DELETE',
      function (done) {
        chai.request(server)
        .post('/user/create')
        .send(validUser)
        .end(function (err1, res1) {
          res1.should.have.status(201);

          chai.request(server)
          .delete('/user/' + validUser.id)
          .end(function (err2, res2) {
            res2.should.have.status(204);

            chai.request(server)
            .get('/user/' + validUser.id)
            .end(function (error, response) {
              response.should.have.status(404);
              done();
            });
          });
        });
      });
});