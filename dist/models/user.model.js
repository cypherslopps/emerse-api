"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const User = dbConfig_1.default.define("User", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM("admin", "customer"),
        defaultValue: "customer"
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
});
exports.default = User;
//# sourceMappingURL=user.model.js.map