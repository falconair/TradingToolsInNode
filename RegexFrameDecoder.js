const stream = require('stream');

class RegexFrameDecoder extends stream.Transform{
  constructor(regex,opt){
    super(opt);
    this.buffer = '';
    this.regex = regex;
  }

  _transform(chunk, encoding, callback){
    const chunks = (this.buffer + chunk).toString().split(this.regex);
    for(var i = 0; i < chunks.length -1; i++){ this.push(chunks[i]); }
    this.buffer = chunks[chunks.length-1];
    callback();
  }
}

module.exports = RegexFrameDecoder;
