import Sequelize from "sequelize";

export default {
    name: 'responses',
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
        request_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        is_allow: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
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