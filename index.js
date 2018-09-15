const mqtt = require('cmmc-mqtt').mqtt
var parser = require("./_packet.js") 
let client = mqtt.create('mqtt://cmmc:cmmc@odin.cmmc.io', ['lora/#']) 
/*
     DevEUI: '008F8E9F3507855F',
     DevAddr: 'E01B6D61',
     FPort: '15',
     FCntUp: '87',
     ADRbit: '1',
     MType: '4',
     FCntDn: '86',
     payload_hex: 'ff00c30a0000de110000427a0100040000004e415400000000000000',
     mic_hex: '1b6e8911',
     Lrcid: '00000231',
     LrrRSSI: '-55.000000',
     LrrSNR: '8.000000',
     SpFact: '7',
*/
client.register('on_message', (topic, payload) => {
  const json = JSON.parse(payload.toString());
  const lora = json.DevEUI_uplink;
  console.log(`user payload = ${lora.payload_hex}`)
  let packet = parser.parse(Buffer.from(lora.payload_hex, 'hex'))
  let [temperature, humidity, pressure, field4, name] = 
	[ packet.field1/100, packet.field2/100, packet.field3/100, packet.field4, packet.device_name ]
  let [LrrRSSI, LrrSNR, FCntUp, SpFact] = [ lora.LrrRSSI, lora.LrrSNR, lora.FCntUp].map(parseFloat) 
  let [DevEUI, DevAddr] = [lora.DevEUI, lora.DevAddr]

  console.log(`temperature=${temperature},  humidity=${humidity}, pressure=${pressure}, name=${name}`)
  console.log(`LrrRSSI=${LrrRSSI}, LrrSNR=${LrrSNR}, FCntUp=${FCntUp}`) 
  let p = { temperature, humidity, pressure, name, LrrRSSI, LrrSNR, FCntUp, DevEUI, DevAddr }

  console.log(p)
});

client.mqtt_on('connect', () => {
  console.log('connected') 
});

