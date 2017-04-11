'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.createTable('users', {
        id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            length: 11
        },
        first_name: {
            type: 'string',
            length: 50,
            notNull: true
        },
        last_name: {
            type: 'string',
            length: 50,
            notNull: true
        },
        email: {
            type: 'string',
            length: 100,
            notNull: true
        },
        mobile: {
            type: 'string',
            length: 15,
            notNull: false
        },
        password: {
            type: 'string',
            length: 200,
            notNull: true
        },
        balance_chips: {
            type: 'bigint',
            length: 20,
            defaultValue: 1000,
            notNull: true
        },
        is_verified: {
            type: 'smallint',
            length: 1,
            defaultValue: 0,
            notNull: true
        },
        created_on:{
            type: 'datetime',
            notNull: false
        },
        updated_on: {
            type: 'timestamp',
            defaultValue: 'CURRENT_TIMESTAMP',
            notNull: true
        }
    });
};

exports.down = function (db) {
    return db.dropTable('users');
};

exports._meta = {
    "version": 1
};
