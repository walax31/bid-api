module.exports = function (auth) {
  const _withAuthentication = () => {
    return auth.check()
  }

  const _withRefreshTokenRevoked = async (
    TokenModel,
    Encryption,
    refreshToken
  ) => {
    try {
      const { token_id } = await TokenModel.query()
        .where({
          token: Encryption.decrypt(refreshToken)
        })
        .fetch()
        .then((response) => response.first().toJSON())

      const token = await TokenModel.find(token_id)

      token.merge({ is_revoked: true })

      await token.save()

      return { token }
    } catch (error) {
      return { error }
    }
  }

  return {
    authenticate: async () => {
      try {
        await _withAuthentication()

        return { error: undefined }
      } catch (error) {
        return { error }
      }
    },
    login: async ({ username, password }) => {
      try {
        const tokens = await auth.withRefreshToken().attempt(username, password)

        return { tokens }
      } catch (error) {
        return { error }
      }
    },
    getNewToken: async (refreshToken) => {
      try {
        const tokens = await auth
          .newRefreshToken()
          .generateForRefreshToken(refreshToken)

        return {
          tokens
        }
      } catch (error) {
        return { error }
      }
    },
    logout: async (TokenModel, Encryption, refreshToken) => {
      try {
        //   const { error } = await _withAuthentication();

        //   if (error) throw new Error(error);

        const { data, error } = await _withRefreshTokenRevoked(
          TokenModel,
          Encryption,
          refreshToken
        )

        if (error) throw new Error(error)

        // await auth.authenticator("jwt").revokeTokens([refreshToken]);
        // await auth.authenticator("jwt").revokeTokens();

        return { data }
      } catch (error) {
        return { error }
      }
    },
    validateAdmin: async () => {
      try {
        await _withAuthentication()

        return {
          admin: await auth
            .getUser()
            .then((response) => response.toJSON().is_admin)
        }
      } catch (error) {
        return {
          error
        }
      }
    },
    validateUniqueID: async (CustomerModel) => {
      const user = await auth.getUser().then((response) => response.toJSON())

      const customer = CustomerModel
        ? await CustomerModel.findBy('user_uuid', user.uuid).then((response) =>
            response ? response.toJSON() : {}
          )
        : {}

      return { user_uuid: user.uuid, customer_uuid: customer.uuid }
    },
    getUsername: () => {
      return auth.getUser().then((response) => response.toJSON().username)
    }
  }
}
