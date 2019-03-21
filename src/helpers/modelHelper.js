module.exports = {
    parseUser: (user) => {
        const entity = {};
        entity.id = user._id;
        entity.name = user.name;
        entity.email = user.email;

        return entity;
    },

    parseResource: (resource) => {
        const entity = {};

        entity.id = resource._id;
        entity.name = resource.name;

        return entity;
    },

};
