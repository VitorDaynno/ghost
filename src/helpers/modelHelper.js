module.exports = {
    parseUser: function(user){
        var entity = {};
        entity.id = user._id;
        entity.name = user.name;
        entity.email= user.email;

        return entity;
    },
    parseAccount: function(account){
        if (Array.isArray(account)) {
            return account.map(function(item){
                var entity = {};
                entity.id = item._id;
                entity.name = item.name;
                entity.type = item.type;
                return entity;
            });
        }

        var entity = {};
        entity.id = account._id;
        entity.name = account.name;
        entity.type = account.type;

        return entity;
    },
    parseTransaction: function(transaction){
        var entity = {};
        entity.id = transaction._id;
        entity.description = transaction.description;
        entity.value = transaction.value;
        entity.categories = transaction.categories;
        entity.purchaseDate = transaction.purchaseDate;
        entity.account = transaction.account;

        return entity;
    },
    parseBalance: function(balance){
        if (Array.isArray(balance)) {
            return balance.map(function(item){
                var entity = {};
                entity.id = item._id;
                entity.balance = item.balance;
                entity.name = item.account[0].name;
                return entity;
            });
        }
        var entity = {};
        entity.id = balance._id;
        entity.balance = balance.balance;
        entity.name = balance.account[0].name;
        return entity;
    }
};
