const FIXSession = require('./FIXSession.js');
const msgs   = require('./msgs42.json');
const fields   = require('./fields42.json');

class Heartbeater extends require('stream').Transform{
  constructor(fix_session, options){
    super(options);
    this.enabled = false;
    this.last_msg_sent_ts = new Date();
    this.timer = null;
    this.fix_session = fix_session;
  }

  attemptHB_(heartbeat_sec){
    if((new Date() - this.last_msg_sent_ts)/ 1000 >= heartbeat_sec ){
      this.last_msg_sent_ts = new Date();//assume away concurrency problems...yolo
      const hb = this.fix_session.create_msg(msgs['Heartbeat']);
      this.push(this.fix_session.toFIXString(hb));
    }

  }

  enable(heartbeat_interval_seconds){
    this.enabled = true;
    const heartbeat_sec = parseInt(heartbeat_interval_seconds, 10);

    //kick off heartbeats
    this.timer = setInterval(()=>{ this.attemptHB_(heartbeat_sec); }, heartbeat_sec * 1000 / 2);
    this.attemptHB_(heartbeat_sec);

  }

  disable(){
    this.enabled = false;
    if(this.timer) clearInterval(this.timer);
  }

  isEnabled(){ return this.enabled; }

  _transform(chunk, encoding, callback){
    this.last_msg_sent_ts = new Date();
    callback(null, chunk);
  }
}


module.exports = Heartbeater;
