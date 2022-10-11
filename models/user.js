'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Course, {
        as: 'user',
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'First Name Cannot be empty',
          },
          notEmpty: {
            msg: 'Please provide a first name',
          },
          is: {
            args: [/^[a-z ,.'-]+$/i],
            msg: 'First name should be valid',
          },
          len: {
            args: [2, 30],
            msg: 'First name should be less than 30 characters',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Last Name Cannot be empty',
          },
          notEmpty: {
            msg: 'Please provide a last name',
          },
          is: {
            args: /^[a-z ,.'-]+$/i,
            msg: 'Last Name should be valid',
          },
          len: {
            args: [2, 30],
            msg: 'Last name should be less than 30 characters',
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        unique: {
          msg: 'This Email Address has already been used',
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Email field cannot be empty',
          },
          notEmpty: {
            msg: 'Please provide a Email Address',
          },
          isEmail: {
            msg: 'Email Address should be valid',
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'please provide a password',
          },
          notEmpty: {
            msg: 'please provide a password',
          },
          // len: {
          //   args: [8, 30],
          //   msg: 'password should be atleast 8 characters long',
          // },
        },

        set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
