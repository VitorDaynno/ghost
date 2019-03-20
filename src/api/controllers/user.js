var logger = require('../../config/logger')();
var BOFactory = require('../../factories/factoryBO');

module.exports = function() {
    var business = BOFactory.getBO('user');

    return {
        auth: function(req, res){
            logger.info('[User-Controller] Auth a user by email ' + req.body.email);
            business.auth(req.body)
                .then(function(user){
                    res.send(user);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        },

        getById: function(req, res){
            logger.info('[User-Controller] Getting user by id ' + req.params.id);
            var id = req.params.id ? req.params.id : null;
            business.getById({id: id})
                .then(function(user){
                    res.send(user);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        },

        save: function(req, res){
            logger.info('[User-Controller] Save a user');
            body = req.body ? req.body: {};
            business.save(body)
                .then(function(user){
                    res.status(201).json(user);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        },

        update: function(req, res){
            logger.info('[User-Controller] updating user by id ' + req.params.id);
            var id = req.params.id ? req.params.id : null;
            body = req.body ? req.body : {};
            body.id = id;
            business.update(body)
                .then(function(user){
                    res.send(user);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        },

        delete: function(req, res){
            logger.info('[User-Controller] Deleting user by id ' + req.params.id);
            var id = req.params.id ? req.params.id : null;
            business.delete({id: id})
                .then(function(user){
                    res.send(user);
                })
                .catch(function(error){
                    res.status(error.code).json(error.message);
                });
        }
    };
};
