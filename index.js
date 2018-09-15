const mqtt = require('cmmc-mqtt').mqtt
var parser = require("./_packet.js") 
let client = mqtt.create('mqtt://cmmc:cmmc@odin.cmmc.io', ['lora/#']) 

client.register('on_message', (topic, payload) => {
  const json = JSON.parse(payload.toString());
  const lora = json.DevEUI_uplink;
  console.log(`user payload = ${lora.payload_hex}`)
  let packet = parser.parse(Buffer.from(lora.payload_hex, 'hex'))
  let [temperature, humidity, pressure, field4, name] = 
	[ packet.field1/100, packet.field2/100, packet.field3/100, packet.field4, packet.device_name ]
  let [LrrRSSI, LrrSNR, FCntUp, SpFact, FCntDn] = [ lora.LrrRSSI, lora.LrrSNR, lora.FCntUp, lora.SpFact, lora.FCntDn].map(parseFloat) 
  let [DevEUI, DevAddr] = [lora.DevEUI, lora.DevAddr]

  console.log(`temperature=${temperature},  humidity=${humidity}, pressure=${pressure}, name=${name}`)
  console.log(`LrrRSSI=${LrrRSSI}, LrrSNR=${LrrSNR}, FCntUp=${FCntUp}, FCntDn=${FCntDn}`) 
  let p = { temperature, humidity, pressure, name, LrrRSSI, LrrSNR, FCntUp, DevEUI, DevAddr } 
  console.log(p)
  client.publish(`CMMC/LoRa_${name}/status`, JSON.stringify(p))
});

client.mqtt_on('connect', () => {
  console.log('connected') 
});

