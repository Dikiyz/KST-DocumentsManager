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
            allowNull: false
        },
        student_name: {
            type: Sequelize.STRING(256),
            allowNull: false,
            defaultValue: ""
        },
        doc_type_id: {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue: 0
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