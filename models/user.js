'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1,99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: { //this does a boolean check
          msg: 'Invalid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be between 8 and 99 characters'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });
    //Before a user is created. we are encrypting the password and using the hash in its place
  user.addHook('beforeCreate', (pendingUser)=> {//pendinguser is object that gets passed to DB
    //bcrypt is going to has the password
    let hash = bcrypt.hashSync(pendingUser.password, 12);
    pendingUser.password = hash;//this will go to the DB
  });

  //checking the password on Sign-in and comparing to the hashed password in the DB
  user.prototype.validPassword = function(typedPassword){
    let isCorrectPassword = bcrypt.compareSync(typedPassword, this.password); //check to see if password is correct.
    return isCorrectPassword;
  }

  //returns an object from the db of the user without the encrypted password
  user.prototype.toJSON = function() {
    let userData = this.get(); 
    delete userData.password; //it does not delete from DB
    return userData;
  }
  return user;
};