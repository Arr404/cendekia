/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('authentications',{
        token:{
            type:'text',
            notNull:true
        }
    })
    pgm.createTable('account',{
        id:{
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        email:{ type:'text',notNull:true },
        password: { type:'text', notNull:true }
    })
    pgm.createTable('user', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: { type: 'varchar(1000)', notNull: true },
        picture:{ type: 'varchar(1000)', notNull:false},
        username: { type: 'varchar(1000)', notNull:true},
        bio: { type: 'varchar(1000)', notNull:true},
        accountId:{
            type: 'varchar(50)',
            notNull: true,
            references: '"account"',
            onDelete: 'cascade',
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
    pgm.createTable('posts', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        userId: {
            type: 'varchar(50)',
            notNull: true,
            references: '"user"',
            onDelete: 'cascade',
        },
        description: { type: 'text', notNull: true },
        kategori: { type:'varchar(1000)', notNull:true},
        subCategory: {type:'text', notNull:false},
        picture: { type:'text', notNull: true},
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
    pgm.createTable('save',{
        userId: {
            type: 'varchar(50)',
            notNull: true,
            references: '"user"',
            onDelete: 'cascade',
        },
        postId:{
            type:'varchar(50)',
            notNull: true,
            references: '"posts"',
            onDelete:'cascade'
        }
    })
    pgm.createTable('summary',{
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        postId:{
            type:'VARCHAR(50)',
            notNull:true,
            references: '"posts"',
            onDelete:'cascade'
        },
        summary: {type:'text',notNull:true}
    })
    pgm.createTable('comment',{
        id:{
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        postId:{
            type:'VARCHAR(50)',
            notNull:true,
            references: '"posts"',
            onDelete:'cascade'
        },
        comment: { type:'text', notNull:true },
        userId:{
            type:'VARCHAR(50)',
            notNull:true,
            references:'"user"',
            onDelete:'cascade'
        }
    })
    pgm.createTable('follow',{
        id:{
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        userId:{
            type:'VARCHAR(50)',
            notNull:true,
            references: '"user"',
            onDelete:'cascade'
        },
        userIdFollow:{
            type:'VARCHAR(50)',
            notNull:true,
            references: '"user"',
            onDelete:'cascade'
        }
    })
    pgm.createTable('like',{
        id:{
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        postId:{
            type:"VARCHAR(50)",
            notNull:true,
            references:'"posts"',
            onDelete:'cascade'
        },
        userId:{
            type:'VARCHAR(50)',
            notNull:true,
            references:'"user"',
            onDelete:'cascade'
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('authentications')
    pgm.dropTable('summary');
    pgm.dropTable('save');
    pgm.dropTable('follow');
    pgm.dropTable('like');
    pgm.dropTable('comment');
    pgm.dropTable('posts');
    pgm.dropTable('user');
    pgm.dropTable('account');
};
