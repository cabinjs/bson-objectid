BSON ObjectID
=============

This mdoule allows you to create and parse `ObjectID`s without a reference to the
[mongodb](https://github.com/mongodb/node-mongodb-native) or [bson](https://github.com/mongodb/js-bson)
modules.

The goal is to be 100% compatable with all [bson](https://github.com/mongodb/js-bson)'s
public API implementation (found here: https://github.com/mongodb/js-bson/blob/master/lib/bson/objectid.js).

## Install
    $ npm install bson-objectid

## Usage

### ObjectID()<br>ObjectID(time)<br>ObjectID(hexString)<br>ObjectID(idString)
Creates a new immutable `ObjectID` instance based on the current system time.

Possible arguments:
**time** Constructs the instance based on the specified time (in seconds).
**hexString** Constructs the instance from a 24 character hex string.
**idString** Constructs the instance from a 12 byte string.

#### #id
**returns** the 12 byte id string.

#### #str
#### #toHexString()
**returns** the `ObjectID` represented as a 24 character hex string.

#### #equals(other)
**returns** true if the `ObjectID`s represent the same underlying value. Otherwise false.
#### #getTimestamp()
**returns** the generation `Date` (accurate up to the second) that this `ObjectID` was generated.

### ObjectID.createFromTime(time)
Creates an ObjectID from a time (in seconds) `Number`, with the rest of the `ObjectID` zeroed out. Used for comparisons or sorting the ObjectID.

### ObjectID.createFromHexString(hexString)
Creates an ObjectID from a 24 character hex string.

### ObjectID.isValid(hexString)<br>ObjectID.isValid(ObjectID)
Checks if a value is a valid `ObjectID` or 24 character hex string.
> THE NATIVE DOCUMENTATION ISN'T CLEAR ON THIS GUY!<br>
> See: http://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html#objectid-isvalid

#### ObjectID.generate()<br>ObjectID.generate(time)
You can use this to generate a 24 character hex string without instantiating a `ObjectID` instance.

This diverges from [bson](https://github.com/mongodb/js-bson)'s implementation which returns the 12 byte string.

**returns** a valid 24 character `ObjectID` hex string.

#### ObjectID or ObjectId
`ObjectID` is aliased as `ObjectId` for convience and compatibility with [bson](https://github.com/mongodb/js-bson).

## Test
    mocha

or

    npm test

License
=======
Apache v2.0

See LICENSE file.
