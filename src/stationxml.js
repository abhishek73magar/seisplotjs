// @flow

import { checkStringOrDate, hasArgs, hasNoArgs, isStringArg, isNumArg } from './util';


// flow type for moment type
import { moment } from './util';
//import type { moment as momentType } from 'moment';
import type {ComplexType } from './util';



// StationXML classes

export class Network {
  networkCode: string;
  _startDate: moment;
  _endDate: moment;
  restrictedStatus: string;
  description: string;
  totalNumberStations: number;
  stations: Array<Station>;
  constructor(networkCode: string) {
    this.networkCode = networkCode;
    this.stations = [];
  }
  get startDate() {
    return this._startDate;
  }
  set startDate(value?: moment | string) {
    this._startDate = checkStringOrDate(value);
  }
  get endDate() {
    return this._endDate;
  }
  set endDate(value?: moment | string) {
    this._endDate = checkStringOrDate(value);
  }
  codes(): string {
    return this.networkCode;
  }
  isTempNet(): boolean {
    const first = this.networkCode.charAt(0);
    return first === 'X' || first === 'Y' || first === 'Z' || (first >= '0' && first <= '9');
  }
}

export class Station {
  network: Network;
  stationCode: string;
    /** @private */
  _startDate: moment;
    /** @private */
  _endDate: moment;
  restrictedStatus: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  channels: Array<Channel>;
  constructor(network: Network, stationCode: string) {
    this.network = network;
    this.stationCode = stationCode;
    this.channels = [];
  }
  get startDate() {
    return this._startDate;
  }
  set startDate(value?: moment | string) {
    this._startDate = checkStringOrDate(value);
  }
  get endDate() {
    return this._endDate;
  }
  set endDate(value?: moment | string) {
    this._endDate = checkStringOrDate(value);
  }
  codes():string {
    return this.network.codes()+"."+this.stationCode;
  }
}

export class Channel {
  station: Station;
    /** @private */
  _locationCode: string;
  channelCode: string;
    /** @private */
  _startDate: moment;
    /** @private */
  _endDate: moment;
  restrictedStatus: string;
  latitude: number;
  longitude: number;
  elevation: number;
  depth: number;
  azimuth: number;
  dip: number;
  sampleRate: number;
  response: Response;
  constructor(station: Station, channelCode: string, locationCode: string) {
    this.station = station;
    this.channelCode = channelCode;
    this.locationCode = locationCode;
    if (! locationCode) {
      // make sure "null" is encoded as empty string
      this.locationCode = '';
    }
  }
  get startDate() {
    return this._startDate;
  }
  set startDate(value?: moment | string) {
    this._startDate = checkStringOrDate(value);
  }
  get endDate() {
    return this._endDate;
  }
  set endDate(value?: moment | string) {
    this._endDate = checkStringOrDate(value);
  }
  get locationCode() {
    return this._locationCode;
  }
  set locationCode(value: string) {
    this._locationCode = value;
    if (! value) {
      // make sure "null" is encoded as empty string
      this._locationCode = '';
    }
  }
  set instrumentSensitivity(value: InstrumentSensitivity) {
    if (typeof this.response == 'undefined') {
      this.response = new Response(value);
    } else {
      this.response.instrumentSensitivity = value;
    }
    return this;
  }
  get instrumentSensitivity() :InstrumentSensitivity {
    if (this.response) {
      return this.response.instrumentSensitivity;
    } else {
      throw new Error("no Response or InstrumentSensitivity defined");
    }
  }

  codes(): string {
    return this.station.codes()+"."+this.locationCode+"."+this.channelCode;
  }
}

export class InstrumentSensitivity {
  sensitivity: number;
  frequency: number;
  inputUnits: string;
  outputUnits: string;
  constructor(sensitivity: number, frequency: number, inputUnits: string, outputUnits: string) {
    this.sensitivity = sensitivity;
    this.frequency = frequency;
    this.inputUnits = inputUnits;
    this.outputUnits = outputUnits;
  }
}

export class Response {
  instrumentSensitivity: InstrumentSensitivity;
  stages: Array<Stage>;
  constructor(instrumentSensitivity?: InstrumentSensitivity, stages?: Array<Stage>) {
    if (instrumentSensitivity) {
      this.instrumentSensitivity = instrumentSensitivity;
    }
    if (stages) {
      this.stages = stages;
    }
  }
}

export class Stage {
  filter: AbstractFilterType | null;
  decimation: Decimation | null;
  gain: Gain;
  constructor(filter: AbstractFilterType | null, decimation: Decimation | null, gain: Gain) {
    this.filter = filter;
    this.decimation = decimation;
    this.gain = gain;
  }
}

export class AbstractFilterType {
  inputUnits: string;
  outputUnits: string;
  name: string;
  description: string;
  constructor(inputUnits: string, outputUnits: string) {
    this.inputUnits = inputUnits;
    this.outputUnits = outputUnits;
  }
}
export class PolesZeros extends AbstractFilterType {
  pzTransferFunctionType: string;
  normalizationFactor: number;
  normalizationFrequency: number;
  zeros: Array<ComplexType>;
  poles: Array<ComplexType>;
  constructor(inputUnits: string, outputUnits: string) {
    super(inputUnits, outputUnits);
  }
}

export class FIR extends AbstractFilterType {
  symmetry: string;
  numerator: Array<number>;
  constructor(inputUnits: string, outputUnits: string) {
    super(inputUnits, outputUnits);
  }
}

export class CoefficientsFilter extends AbstractFilterType {
  cfTransferFunction: string;
  numerator: Array<number>;
  denominator: Array<number>;
  constructor(inputUnits: string, outputUnits: string) {
    super(inputUnits, outputUnits);
  }
}

export class Decimation {
  inputSampleRate: number;
  factor: number;
  offset: number;
  delay: number;
  correction: number;
}

export class Gain {
  value: number;
  frequency: number;
}
