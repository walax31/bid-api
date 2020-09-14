module.exports = function (CronJob, fetch, token, attributes, timeInHours) {
  return new CronJob(
    new Date(new Date().setHours(new Date().getHours() + timeInHours)),
    async function () {
      const response = await fetch("http://localhost:3333/api/v1/orders", {
        method: "POST",
        body: JSON.stringify(attributes),
        header: JSON.stringify({
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }),
      }).then((response) => response.json());

      console.log(`${response} is completed at ${new Date()}.`);

      this.stop();
    },
    null,
    true,
    "Asia/Bangkok"
  );
};
