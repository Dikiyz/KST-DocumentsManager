import Sequelize from "sequelize";

export default {
    name: 'requests',
    params: {
        id: {
            autoIncrement: true,
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: null
        },
        student_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: null
        },
        doc_type_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: null
        },
        is_allow: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: null
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