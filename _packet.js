const Parser = require('binary-parser').Parser
//const formatters = require('./formatter')
/*
CMMC_Sensor.h
  typedef struct __attribute((__packed__)) {
    uint16_t battery;
    int32_t field1;
    int32_t field2;
    int32_t field3;
    int32_t field4;
    char name[6];
    uint32_t ms = 0;
  } CMMC_SENSOR_DATA_T;

*/

const sensorNodeParser = Parser.start()
  //.endianess('big')
  .endianess('little')
  .uint16('battery')
  .int32('field1')
  .int32('field2')
  .int32('field3')
  .int32('field4')
  .string('device_name', {length: 6, stripNull: true})
  .uint32('node_ms')

module.exports = sensorNodeParser

