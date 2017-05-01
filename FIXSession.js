class FIXSession{

  constructor(beginstring, sendercompid, targetcompid, seqnum_counter = 1 ){
    this.beginstring = beginstring;
    this.sendercompid = sendercompid;
    this.targetcompid = targetcompid;

    this.seqnum_counter = new Counter(seqnum_counter);
    this.orderid_counter = new Counter(0);
    this.execid_counter = new Counter(0);
  }

  static _checksum(fix){
    var chksm = 0;
    for (var i = 0; i < fix.length; i++) { chksm += fix.charCodeAt(i);}

    chksm = chksm % 256;

    var checksumstr = '';
    if (chksm < 10) {
      checksumstr = '00' + (chksm + '');
    } else if (chksm >= 10 && chksm < 100) {
      checksumstr = '0' + (chksm + '');
    } else {
      checksumstr = '' + (chksm + '');
    }

    return checksumstr;
  }

  static _getUTCTimeStamp(datetime) {
    var timestamp = datetime || new Date();

    var year = timestamp.getUTCFullYear();
    var month = timestamp.getUTCMonth() + 1;
    var day = timestamp.getUTCDate();
    var hours = timestamp.getUTCHours();
    var minutes = timestamp.getUTCMinutes();
    var seconds = timestamp.getUTCSeconds();
    var millis = timestamp.getUTCMilliseconds();

    if (month < 10) { month = '0' + month;}
    if (day < 10) {day = '0' + day;}
    if (hours < 10) {hours = '0' + hours;}
    if (minutes < 10) {minutes = '0' + minutes;}
    if (seconds < 10) {seconds = '0' + seconds;}
    if (millis < 10) {millis = '00' + millis;}
    else if (millis < 100) {millis = '0' + millis;}

    var ts = [year, month, day, '-', hours, ':', minutes, ':', seconds, '.', millis].join('');

    return ts;
  }

  static toMap(fix){
    //TODO: Handle groups (therefore, recursive Map)
    const arr = fix.split(/\x01/g).map((e)=>{return e.split('=')});
    return new Map(arr);
  }

  static getMsgType(fixmap){ return fixmap.get('35'); }
  static isMsgType(fixmap, type){ return fixmap.get('35') === type; }//MsgType
  static isExecType(fixmap, type){ return fixmap.get('150') === type; }//ExecType

  create_msg(type, additional_fields={}){//make create_msg static again
    const m = new Map();
    m.set('35',type);//MsgType
    m.set('8',this.beginstring);//BeginString
    m.set('49',this.sendercompid);//SenderCompID
    m.set('56',this.targetcompid);//TargetCompID

    for(let key of Object.keys(additional_fields)){
      m.set(key, additional_fields[key]);
    }

    return m;
  }



  toFIXString(fixmap,calcFields={'bodylength':true, 'checksum':true, 'msgseqnum':true, 'sendingtime':true}){
    const SOH = '\x01';

    let tag8  = fixmap.get('8')  || false; fixmap.delete('8');//BeginString
    let tag9  = fixmap.get('9')  || false; fixmap.delete('9');//length
    let tag35 = fixmap.get('35') || false; fixmap.delete('35');//MsgType
    let tag10 = fixmap.get('10') || false; fixmap.delete('10');//checksum
    let tag34 = fixmap.get('34') || false; fixmap.delete('34');//MsgSeqNum
    let tag52 = fixmap.get('52') || false; fixmap.delete('52');//SendingTime

    let fixarr = Array.from(fixmap);
    //fixarr.pop();//Array.from seems to add an empty element
    let body_no_seqnum_sendtime = fixarr.map((e)=>{return e.join('=')}).join(SOH);

    let seqnum_sendtime = [];

    if(calcFields['sendingtime']) seqnum_sendtime.push('52='+FIXSession._getUTCTimeStamp());
    else if(tag52) seqnum_sendtime.push('52='+tag52);

    if(calcFields['msgseqnum']) seqnum_sendtime.push('34='+this.seqnum_counter.next());
    else if(tag34) seqnum_sendtime.push('34='+tag34);

    const body = ['35='+ tag35, seqnum_sendtime.join(SOH) , body_no_seqnum_sendtime,''].join(SOH);

    let header = []

    if(tag8) header.push('8='+tag8);

    if(calcFields['bodylength']) header.push('9='+(body.length ));
    else if(tag9) header.push('9='+tag9);

    const headbody = [header.join(SOH) , body].join(SOH);

    let tail = [];

    if(calcFields['checksum']) tail.push('10='+FIXSession._checksum(headbody));
    else if(tag10) tail.push('10='+tag10);

    const headbodytail = [headbody , tail.join(SOH),SOH].join('');

    //console.log(headbodytail);
    return headbodytail;

  }
}

class Counter{
  constructor(initial_val){
    this.counter = initial_val;
  }

  next(){ return this.counter ++; }
  set(counter) { this.counter = counter; }
  get() { return this.counter; }

}

module.exports = FIXSession;
