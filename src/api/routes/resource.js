const Helper = require('../../helpers/jwtHelper');

module.exports = (app) => {
    const controller = app.controllers.resource;
    const helper = new Helper();

    app.route('/v1/resources')
        .get(helper.verifyToken, controller.getAll)
        .post(helper.verifyToken, controller.save);

    app.route('/v1/resources/:id')
        .get(helper.verifyToken, controller.getById)
        .put(helper.verifyToken, controller.update)
        .delete(helper.verifyToken, controller.delete);
};
