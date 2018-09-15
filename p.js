var parser = require("./_packet.js") 

let out = parser.parse(Buffer.from('0000c80a00008b1200004d7a0100000000004e415400000000000000', 'hex'))
console.log(out)
