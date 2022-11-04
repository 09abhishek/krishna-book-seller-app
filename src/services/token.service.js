const jwt = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
const config = require("../config/config");
const User = require("../models/User");
const userService = require("./user.service");
// const { Token } = require("../models");
const Token = require("../models/Token");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate token
 * @param {string} username
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (username, userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
    username,
    generatedAt: parseInt(Date.now() / 1000, 10),
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  // eslint-disable-next-line no-return-await
  return await Token.create({
    token,
    user_id: userId.toString(),
    expires: expires.toDate(),
    type,
    blacklisted,
  });
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
  const accessToken = generateToken(user.username, user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, "days");
  const refreshToken = generateToken(user.username, user.id, refreshTokenExpires, tokenTypes.REFRESH);
  // Enable next line to save refresh token in db
  // await saveToken(refreshToken, user.id.toString(), refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} username
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (username) => {
  const user = await userService.getUserByUserName(username);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this username");
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, "minutes");
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, "minutes");
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
