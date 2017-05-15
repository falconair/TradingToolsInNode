#!/usr/bin/node
'use strict';

const net    = require('net');
const stream = require('stream');

const RegexFrameDecoder = require('./RegexFrameDecoder.js');
const FIXSession  = require('./FIXSession.js');
const Heartbeater = require('./Heartbeater.js');

const msgs   = require('./msgs42.json');
const fields = require('./fields42.json');

const fix_session = new FIXSession( "FIX.4.2", 'SENDER', 'TARGET');
const heartbeater = new Heartbeater(fix_session);


const socket = new net.Socket();
socket.setEncoding('ascii');

heartbeater
  .pipe(new stream.Transform({transform(chunk,e,cb){console.log("OUTGOING:"+chunk.toString());cb(null,chunk);}}))
  .pipe(socket);

socket
  .pipe(new RegexFrameDecoder(/(8=.+?\x0110=\d\d\d\x01)/g))
  .pipe(new stream.Transform({transform(chunk,e,cb){console.log("INCOMING:"+chunk.toString());cb(null,chunk);}}))
  .on('data', (data)=>{
    const fix = data.toString();
    const fixmap = FIXSession.toMap(fix);

    if(FIXSession.isMsgType(fixmap, msgs["Logon"])){
      //kick off heartbeats
      heartbeater.enable(fixmap.get(fields['HeartBtInt']));
    }
  });

socket.on('close', ()=>{
  console.log('Disconnected');
  heartbeater.disable();
});

socket.connect(9878, 'localhost', ()=>{
  console.log('Connected');
  //Send logon
  const logon_ = fix_session.create_msg(msgs['Logon'], {[fields['HeartBtInt']]:'10', [fields['EncryptMethod']]:'0'});
  logon_.set(fields['HeartBtInt'], '10');
  heartbeater.write(fix_session.toFIXString(logon_));
});
