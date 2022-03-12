/// <reference path="../objectid.d.ts" />
import ObjectID from '../objectid';

// ----------------------------------------------------------------------------
// setup test data
const time:number = 1414093117;
const array:number[] = [ 84, 73, 90, 217, 76, 147, 71, 33, 237, 231, 109, 144 ];
const buffer:Buffer = new Buffer([84, 73, 90, 217, 76, 147, 71, 33, 237, 231, 109, 144 ]);
const hexString:string = "54495ad94c934721ede76d90";
const idString:string = "TIZÙLG!íçm";


// ----------------------------------------------------------------------------
// should construct with no arguments
let oid = new ObjectID();

// ----------------------------------------------------------------------------
// should have an `id` property
oid.id;

// ----------------------------------------------------------------------------
// should have a `str` property
oid.str;

// ----------------------------------------------------------------------------
// should construct with a `time` argument
oid = new ObjectID(time);

// ----------------------------------------------------------------------------
// should construct with an `array` argument
oid = new ObjectID(array);

// ----------------------------------------------------------------------------
// should construct with a `buffer` argument
oid = new ObjectID(buffer);

// ----------------------------------------------------------------------------
// should construct with a `hexString` argument
oid = new ObjectID(hexString);

// ----------------------------------------------------------------------------
// should construct with a `idString` argument
oid = new ObjectID(idString);

// ----------------------------------------------------------------------------
// should construct with `ObjectID.createFromTime(time)` and should have 0's at the end
oid = ObjectID.createFromTime(time);

// ----------------------------------------------------------------------------
// should construct with `ObjectID.createFromHexString(hexString)`
oid = ObjectID.createFromHexString(hexString);

// ----------------------------------------------------------------------------
// should construct with no arguments
oid = ObjectID();

// ----------------------------------------------------------------------------
// should have an `id` property
oid.id;

// ----------------------------------------------------------------------------
// should have a `str` property
oid.str;

// ----------------------------------------------------------------------------
// should construct with a `time` argument
oid = ObjectID(time);

// ----------------------------------------------------------------------------
// should construct with an `array` argument
oid = ObjectID(array);

// ----------------------------------------------------------------------------
// should construct with a `buffer` argument
oid = ObjectID(buffer);

// ----------------------------------------------------------------------------
// should construct with a `hexString` argument
oid = ObjectID(hexString);

// ----------------------------------------------------------------------------
// should construct with a `idString` argument
oid = ObjectID(idString);

// ----------------------------------------------------------------------------
// should correctly retrieve timestamp
const timestamp:Date = oid.getTimestamp();

// ----------------------------------------------------------------------------
// should validate valid hex strings
let isValid:boolean = ObjectID.isValid(hexString);

// ----------------------------------------------------------------------------
// should validate legit ObjectID objects
isValid = ObjectID.isValid(oid);

// ----------------------------------------------------------------------------
// should invalidate bad strings
// not necessary for typescript

// ----------------------------------------------------------------------------
// should evaluate equality with .equals()
const id1 = new ObjectID();
const id2 = new ObjectID(id1.str);
const equals:boolean = id1.equals(id2);

// ----------------------------------------------------------------------------
// should evaluate equality with via deepEqual
// not necessary for typescript

// ----------------------------------------------------------------------------
// should convert to a hex string for JSON.stringify
// not necessary for typescript

// ----------------------------------------------------------------------------
// should convert to a hex string for ObjectID.toString()
const toStr:string = oid.toString();

// ----------------------------------------------------------------------------
// should throw and error if constructing with an invalid string
// not necessary for typescript
