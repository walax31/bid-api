"use strict";

const Encryption = use("Encryption");
const performAuthentication = require("../../../util/authenticate.func");
const processMultiPartFile = require("../../../service/multiPartFileProcessor");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");
const Customer = use("App/Models/Customer");
const Token = use("App/Models/Token");
const CronJob = require("cron").CronJob;

class CredentialController {
  async login({ auth, request }) {
    const { username, password } = request.all();

    const { tokens, error } = await performAuthentication(auth).login({
      username,
      password,
    });

    return {
      status: 200,
      error,
      data: tokens,
    };
  }

  async reAuthenticate({ auth, request }) {
    const refreshToken = request.header("refresh_token");

    const { tokens, error } = await performAuthentication(auth).getNewToken(
      refreshToken
    );

    return {
      status: 200,
      error,
      data: tokens,
    };
  }

  async logout({ auth, request }) {
    const refreshToken = request.header("refresh_token");

    const { data, error } = await performAuthentication(auth).logout(
      Token,
      Encryption,
      refreshToken
    );

    // await auth.authenticator("jwt").revokeTokens([refreshToken]);
    // console.log(
    //   await Token.query()
    //     .where({ token: Encryption.decrypt(refreshToken) })
    //     .fetch()
    //     .then((response) => response.first()["$attributes"].token_id)
    // );

    return {
      status: 200,
      error,
      data,
    };
  }

  async validate({ auth, request }) {
    try {
      await performAuthentication(auth).authenticate();

      const credentialPicture = request.file("credential-picture", {
        types: ["image"],
        size: "2mb",
      });

      const { references } = request.qs;

      const { username, user_id } = await auth
        .getUser()
        .then((response) => response["$attributes"]);

      const processedFileReturnValue = await processMultiPartFile(
        credentialPicture,
        username
      );

      if (processedFileReturnValue.error) {
        return {
          status: 500,
          error: processedFileReturnValue.error,
          data: undefined,
        };
      }

      const customer = await makeCustomerUtil(Customer).updateById(
        user_id,
        {
          path_to_credential: `tmpPath/uploads/${processedFileReturnValue.data}.jpg`,
        },
        references
      );

      return {
        status: 200,
        error: undefined,
        data: `awaiting validation. ${customer}`,
      };
    } catch (error) {
      return {
        status: 511,
        error: `${error}`,
        data: undefined,
      };
    }
  }

  async job() {
    const job = new CronJob(
      "1 * * * * *",
      function () {
        console.log("Job fired.");
        this.stop();
      },
      null,
      true,
      "Asia/Bangkok"
    );
    job.start();
  }
}

module.exports = CredentialController;
