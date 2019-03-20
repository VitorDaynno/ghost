var Helper = require('../../helpers/jwtHelper');

module.exports = function(app) {
    var controller = app.controllers.user;
    var helper = new Helper();

    app.route('/v1/users/auth')
        .post(controller.auth);

    app.route('/v1/users')
        .post(helper.verifyToken, controller.save);

    app.route('/v1/users/:id')
        .get(helper.verifyToken, controller.getById)
        .put(helper.verifyToken, controller.update)
        .delete(helper.verifyToken, controller.delete);
};
