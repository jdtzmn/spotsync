module.exports = (options) => {
  return function (socket, next) {
    const onevent = socket.onevent
    socket.onevent = function (packet) {
      // if within the rate time and rate limit, emit socket event
      if (this.rateTime && Date.now() - this.rateTime < options.windowMs && this.requests++ <= options.max) {
        onevent.call(this, packet)
      // otherwise, if the rate time is undefined or past, define it and re/set the requests count
      } else if (this.rateTime && Date.now() - this.rateTime < options.windowMs) {
        if (options.disconnectAfter && this.requests >= options.disconnectAfter) {
          this.disconnect()
        } else if (options.emit) {
          this.emit('toomanyrequests')
        }
      } else {
        onevent.call(this, packet)
        this.rateTime = Date.now()
        this.requests = 1
      }
    }
    next()
  }
}
