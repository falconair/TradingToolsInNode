#!/usr/bin/node
'use strict';

//Odd things
//-expected a market of pipeable components, but not that many
//-many names for same event: close, end, finish depending on ReadableStream, WriteableStream or net
//-there seems to be a Transform stream for incoming data, but why not outgoing?
//-is there a way of passing through all events, such as passing all tcp events on to tcp handler
//-encoding doesn't make sense: if I set encoding to acii, piped transformers still see buffer?
//-docs are somewhat confusing...for _read(size)...how do I use size to transform data?
//--why are _read and _write signatures different??
//-existance of map ad object in javascript is confusing for api design!
//-the dictionaries are generated using FIX44, which means it sometimes causes problems for earlier versions
//--(like ExecTransType not having enums in FIX 44 but having them in 42)
//-How will Map be serialized over websockets?
//-once this is done, add fix 5.x or binary protocols?

//-turn on fancy autocomplete in atom using 'apm install atom-ternjs' for enum/fields/etc completion

//TODO
//-Write 'web admin' for connections
//-Manage seqnum state across restarts?
const net    = require('net');
const stream = require('stream');

const RegexFrameDecoder = require('./RegexFrameDecoder.js');
const FIXSession = require('./FIXSession.js');
const Heartbeater = require('./Heartbeater.js');

const msgs   = require('./msgs42.json');
const fields = require('./fields42.json');
const enums  = require('./enums42.json');
const fix42 = require('./msgs_detail_42.json');

const server = net.createServer((socket) => {
  socket.setEncoding('ascii')
  let fix_session = null;//new FIXSession( "FIX.4.2", 'TARGET', 'SENDER');
  let heartbeater = null;//new Heartbeater(fix_session);


  console.log(`${socket.remoteAddress} connected`);

  socket
    .pipe(new RegexFrameDecoder(/(8=.+?\x0110=\d\d\d\x01)/g))
    .pipe(new stream.Transform({transform(chunk,e,cb){console.log("INCOMING:"+chunk.toString());cb(null,chunk);}}))
    .on('data', (data)=>{
      const fix = data.toString();
      const fixmap = FIXSession.toMap(fix);

      if(FIXSession.isMsgType(fixmap, msgs["Logon"])){
        //create session with correct compids
        fix_session = new FIXSession("FIX.4.2", fixmap.get(fields['TargetCompID']), fixmap.get(fields['SenderCompID']));
        heartbeater = new Heartbeater(fix_session);
        heartbeater
        .pipe(new stream.Transform({transform(chunk,e,cb){console.log("OUTGOING:"+chunk.toString());cb(null,chunk);}}))
        .pipe(socket);

        //kick off heartbeats
        const heartbtint = fixmap.get(fields['HeartBtInt']);
        heartbeater.enable(heartbtint);

        //respond to logon
        const logon_ = fix_session.create_msg(msgs['Logon'], {[fields['HeartBtInt']]:heartbtint, [fields['EncryptMethod']]:'0'});
        heartbeater.write(fix_session.toFIXString(logon_));
      }

      if(FIXSession.isMsgType(fixmap, msgs["NewOrderSingle"])){
        //ack the order
        const orderid = fix_session.orderid_counter.next();

        const ack = fix_session.create_msg(msgs['ExecutionReport']);
        ack.set(fields['ExecID'],fix_session.execid_counter.next());
        ack.set(fields['OrderID'],orderid);
        ack.set(fields['ClOrdID'],fixmap.get(fields['ClOrdID']));
        ack.set(fields['ExecType'], enums[fields['ExecType']]['NEW']);
        ack.set(fields['ExecTransType'], enums[fields['ExecTransType']]['NEW']);
        ack.set(fields['OrdStatus'], enums[fields['OrdStatus']]['NEW']);
        ack.set(fields['Side'], fixmap.get(fields['Side']));
        ack.set(fields['Symbol'], fixmap.get(fields['Symbol']));
        ack.set(fields['LeavesQty'], fixmap.get(fields['OrderQty']));
        ack.set(fields['CumQty'], '0');
        ack.set(fields['AvgPx'], '10');//execute everything at $10

        heartbeater.write(fix_session.toFIXString(ack));

        //send 100 fills
        const fillcount = 10;
        const qty = parseInt(fixmap.get(fields['OrderQty']),10);
        const eachfill = qty/fillcount;

        let leaves = qty;
        let cumqty = 0;

        for(let i = 1; i < fillcount; i++){
          const fill = fix_session.create_msg(msgs['ExecutionReport']);

          cumqty = eachfill * i;
          leaves = qty - cumqty;

          fill.set(fields['ExecID'],fix_session.execid_counter.next());
          fill.set(fields['OrderID'],orderid);
          fill.set(fields['ClOrdID'],fixmap.get(fields['ClOrdID']));
          fill.set(fields['ExecType'], enums[fields['ExecType']]['PARTIAL_FILL']);//FILL
          fill.set(fields['ExecTransType'], enums[fields['ExecTransType']]['NEW']);
          fill.set(fields['OrdStatus'], enums[fields['OrdStatus']]['PARTIALLY_FILLED']);//FILLED
          fill.set(fields['Side'], fixmap.get(fields['Side']));
          fill.set(fields['Symbol'], fixmap.get(fields['Symbol']));
          fill.set(fields['LeavesQty'], leaves);
          fill.set(fields['CumQty'], cumqty);
          fill.set(fields['LastShares'], eachfill);
          fill.set(fields['AvgPx'], '10');//execute everything at $10

          const outgoing = fix_session.toFIXString(fill);
          heartbeater.write(outgoing);

        }
      }

  });

  socket.on('close', ()=>{
    console.log(`${socket.remoteAddress} disconnected`)
    heartbeater.disable();
  });


}).listen(9878,() => {
  console.log('opened server on', server.address());
});
