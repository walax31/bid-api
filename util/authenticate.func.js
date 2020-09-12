module.exports = function (auth) {
  const _withAuthentication = () => {
    return auth.check();
  };

  const _withRefreshTokenRevoked = async (
    TokenModel,
    Encryption,
    refreshToken
  ) => {
    try {
      const { token_id } = await TokenModel.query()
        .where({
          token: Encryption.decrypt(refreshToken),
        })
        .fetch()
        .then((response) => response.first()["$attributes"]);
      // const { token_id } = await auth
      //   .getUser()
      //   .then((response) => response.tokens().fetch())
      //   .then((response) => response.first()["$attributes"]);

      const token = await TokenModel.find(token_id);

      token.merge({ is_revoked: true });

      await token.save();
      // const token = await TokenModel.find(token_id).then((response) =>
      //   response.merge({ is_revoked: true })
      // );

      // await token.save();

      return token;
    } catch (error) {
      return error;
    }
  };

  return {
    authenticate: async () => {
      try {
        await _withAuthentication();

        return { error: undefined };
      } catch (error) {
        return { error };
      }
    },
    login: async ({ username, password }) => {
      try {
        const tokens = await auth
          .withRefreshToken()
          .attempt(username, password);

        return { tokens };
      } catch (error) {
        return error;
      }
    },
    getNewToken: async (refreshToken) => {
      try {
        const tokens = await auth
          .newRefreshToken()
          .generateForRefreshToken(refreshToken);

        //         const revokedTokenMessage = await _withRefreshTokenRevoked(
        //           TokenModel,
        //           Encryption,
        //           refreshToken
        //         );

        // if (revokedTokenMessage.error)
        //   throw new Error(revokedTokenMessage.error);

        return {
          tokens,
        };
      } catch (error) {
        return error;
      }
    },
    logout: async (TokenModel, Encryption, refreshToken) => {
      try {
        //   const { error } = await _withAuthentication();

        //   if (error) throw new Error(error);

        const revokedTokenMessage = await _withRefreshTokenRevoked(
          TokenModel,
          Encryption,
          refreshToken
        );

        if (revokedTokenMessage.error)
          throw new Error(revokedTokenMessage.error);

        // await auth.authenticator("jwt").revokeTokens([refreshToken]);
        // await auth.authenticator("jwt").revokeTokens();

        return { data: revokedTokenMessage };
      } catch (error) {
        return { error };
      }
    },
    validateAdmin: async () => {
      try {
        await _withAuthentication();

        return {
          admin: await auth
            .getUser()
            .then((response) => response["$attributes"].is_admin),
        };
      } catch (error) {
        return {
          error,
        };
      }
    },
    validateIdParam: async (CustomerModel) => {
      const { user_id } = await auth
        .getUser()
        .then((response) => response["$attributes"]);

      const customer = CustomerModel
        ? await CustomerModel.query()
            .where({ user_id })
            .fetch()
            .then((response) => response.first())
        : undefined;

      const customer_id = customer
        ? customer["$attributes"].customer_id
        : undefined;

      return { auth_id: user_id, customer_id };
    },
  };
};
