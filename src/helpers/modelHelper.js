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
        entity.type = resource.type;
        entity.data = resource.data;
        entity.status = resource.status;
        entity.creationDate = resource.creationDate;

        if (resource.modificationDate) {
            entity.modificationDate = resource.modificationDate;
        }

        return entity;
    },

};
