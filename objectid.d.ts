import {Buffer} from 'buffer';

export default ObjectID

declare const ObjectID: ObjectIDCtor;

declare interface ObjectID {
  readonly id: string;
  readonly str: string;

  toHexString(): string;
  equals(other: ObjectID): boolean;
  getTimestamp(): Date;
}

declare interface ObjectIDCtor {
  (): ObjectID
  (time: number): ObjectID
  (hexString: string): ObjectID
  (idString: string): ObjectID
  (array: number[]): ObjectID
  (buffer: Buffer): ObjectID

  new(): ObjectID
  new(time: number): ObjectID
  new(hexString: string): ObjectID
  new(idString: string): ObjectID
  new(array: number[]): ObjectID
  new(buffer: Buffer): ObjectID


  createFromTime(time: number): ObjectID;
  createFromHexString(hexString: string): ObjectID;
  isValid(hexString: string): boolean;
  isValid(ObjectID: ObjectID): boolean;
  toString(): string;
}
