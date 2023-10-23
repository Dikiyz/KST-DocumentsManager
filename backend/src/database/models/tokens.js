import Sequelize from "sequelize";

export default {
    name: 'tokens',
    params: {
        id: {
            autoIncrement: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        key: {
            type: Sequelize.STRING(512),
            allowNull: false,
            defaultValue: ""
        },
        expired: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.fn('current_timestamp')
        },
        timestamp: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.fn('current_timestamp')
        }
    }, params2: {
        timestamps: false,
        freezeTableName: true,
        indexes: [
            { unique: true, fields: ['id'] }
        ]
    }
}