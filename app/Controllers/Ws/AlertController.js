"use strict";

class AlertController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;

    console.log("A new subscription for this user", socket.topic);
  }

  onMessage(message) {
    // this.socket.broadcastToAll("message", message);
    console.log("got message", message);
  }

  onClose() {
    console.log("closing subscription for this user", this.socket.topic);
  }
}

module.exports = AlertController;
