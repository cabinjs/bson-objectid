var MACHINE_ID = Math.floor(Math.random() * 0xFFFFFF);
var global_index = ObjectId.index = parseInt(Math.random() * 0xFFFFFF, 10);
var pid = (typeof process === 'undefined' || typeof process.pid !== 'number' ? Math.floor(Math.random() * 100000) : process.pid) % 0xFFFF;
// <https://github.com/williamkapke/bson-objectid/pull/51>
// Attempt to fallback Buffer if _Buffer is undefined (e.g. for Node.js).
// Worst case fallback to null and handle with null checking before using.
var BufferCtr = (() => { try { return _Buffer; }catch(_){ try{ return Buffer; }catch(_){ return null; } } })();

/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 */
var isBuffer = function (obj) {
  return !!(
    obj != null &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj)
  )
};

// Precomputed hex table enables speedy hex string conversion
var hexTable = [];
for (var i = 0; i < 256; i++) {
  hexTable[i] = (i <= 15 ? '0' : '') + i.toString(16);
}

// Regular expression that checks for hex value
var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

// Lookup tables
var decodeLookup = [];
i = 0;
while (i < 10) decodeLookup[0x30 + i] = i++;
while (i < 16) decodeLookup[0x41 - 10 + i] = decodeLookup[0x61 - 10 + i] = i++;

/**
 * Create a new immutable ObjectId instance
 *
 * @class Represents the BSON ObjectId type
 * @param {String|Number} id Can be a 24 byte hex string, 12 byte binary string or a Number.
 * @return {Object} instance of ObjectId.
 */
function ObjectId(id) {
  if(!(this instanceof ObjectId)) return new ObjectId(id);
  if(id && ((id instanceof ObjectId) || id._bsontype==="ObjectId"))
    return id;

  this._bsontype = 'ObjectId';

  // The most common usecase (blank id, new objectId instance)
  if (id == null || typeof id === 'number') {
    // Generate a new id
    this.id = this.generate(id);
    // Return the object
    return;
  }

  // Check if the passed in id is valid
  var valid = ObjectId.isValid(id);

  // Throw an error if it's not a valid setup
  if (!valid && id != null) {
    throw new Error(
      'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
    );
  } else if (valid && typeof id === 'string' && id.length === 24) {
    return ObjectId.createFromHexString(id);
  } else if (id != null && id.length === 12 && typeof id === 'string') {
    this.id = Uint8Array.from(Array.from(id).map(letter => letter.charCodeAt(0)));
  }  else if (id != null && id.length === 12 && id instanceof Uint8Array) {
    this.id = id;
  } else if (id != null && typeof id.toHexString === 'function') {
    // Duck-typing to support ObjectId from different npm packages
    return id;
  } else {
    throw new Error(
      'Argument passed in must be an Uint8Array of length 12  or a string of 24 hex characters'
    );
  }
}
module.exports = ObjectId;
ObjectId.default = ObjectId;

/**
 * Creates an ObjectId from a second based number, with the rest of the ObjectId zeroed out. Used for comparisons or sorting the ObjectId.
 *
 * @param {Number} time an integer number representing a number of seconds.
 * @return {ObjectId} return the created ObjectId
 * @api public
 */
ObjectId.createFromTime = function(time){
  time = parseInt(time, 10) % 0xFFFFFFFF;
  return new ObjectId(hex(8,time)+"0000000000000000");
};

/**
 * Creates an ObjectId from a hex string representation of an ObjectId.
 *
 * @param {String} hexString create a ObjectId from a passed in 24 byte hexstring.
 * @return {ObjectId} return the created ObjectId
 * @api public
 */
ObjectId.createFromHexString = function(hexString) {
  // Throw an error if it's not a valid setup
  if (typeof hexString === 'undefined' || (hexString != null && hexString.length !== 24)) {
    throw new Error(
      'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
    );
  }

  const data = new Uint8Array(12);
  let i = 0;

  while (i < 24) {
    data[i >> 1] = (decodeLookup[hexString.charCodeAt(i++)] << 4) | decodeLookup[hexString.charCodeAt(i++)];
  }

  return new ObjectId(data);
};

/**
 * Checks if a value is a valid bson ObjectId
 *
 * @param {String} objectid Can be a 24 byte hex string or an instance of ObjectId.
 * @return {Boolean} return true if the value is a valid bson ObjectId, return false otherwise.
 * @api public
 *
 * THE NATIVE DOCUMENTATION ISN'T CLEAR ON THIS GUY!
 * http://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html#objectid-isvalid
 */
ObjectId.isValid = function(id) {
  if (id == null) return false;

  if (typeof id === 'number') {
    return true;
  }

  if (typeof id === 'string') {
    return id.length === 12 || (id.length === 24 && checkForHexRegExp.test(id));
  }

  if (id instanceof ObjectId) {
    return true;
  }

  if (id instanceof Uint8Array) {
    return id.length === 12;
  }

  // <https://github.com/williamkapke/bson-objectid/issues/53>
  if (isBuffer(id)) {
    return ObjectId.isValid(id.toString('hex'));
  }

  // Duck-Typing detection of ObjectId like objects
  // <https://github.com/williamkapke/bson-objectid/pull/51>
  if (typeof id.toHexString === 'function') {
    if(
      BufferCtr &&
      (id.id instanceof BufferCtr || typeof id.id === 'string')
    ) {
      return id.id.length === 12 || (id.id.length === 24 && checkForHexRegExp.test(id.id));
    }
  }

  return false;
};

ObjectId.prototype = {
  constructor: ObjectId,

  /**
   * Used internally by mongodb
   *
   * @param {uint8array} the current serialized object.
   * @param {index} the position where the serialized ObjectId should be inserted from.
   * @return {Number} return length of the ObjectId, 12 bytes.
   * @api public
   */
  serializeInto: function(uint8array, index) {
    uint8array[index] = this.id.at(0);
    uint8array[index + 1] = this.id.at(1);
    uint8array[index + 2] = this.id.at(2);
    uint8array[index + 3] = this.id.at(3);
    uint8array[index + 4] = this.id.at(4);
    uint8array[index + 5] = this.id.at(5);
    uint8array[index + 6] = this.id.at(6);
    uint8array[index + 7] = this.id.at(7);
    uint8array[index + 8] = this.id.at(8);
    uint8array[index + 9] = this.id.at(9);
    uint8array[index + 10] = this.id.at(10);
    uint8array[index + 11] = this.id.at(11);
    return 12;
  },

  /**
   * Return the ObjectId id as a 24 byte hex string representation
   *
   * @return {String} return the 24 byte hex string representation.
   * @api public
   */
  toHexString: function() {
    if (!this.id || !this.id.length) {
      throw new Error(
        'invalid ObjectId, ObjectId.id must be either a string or a Buffer, but is [' +
          JSON.stringify(this.id) +
          ']'
      );
    }

    if (this.id.length === 24) {
      return this.id;
    }

    if (isBuffer(this.id)) {
      return this.id.toString('hex')
    }

    var hexString = '';
    for (var i = 0; i < this.id.length; i++) {
      hexString += hexTable[this.id.at(i)];
    }

    return hexString;
  },

  /**
   * Compares the equality of this ObjectId with `otherID`.
   *
   * @param {Object} otherId ObjectId instance to compare against.
   * @return {Boolean} the result of comparing two ObjectId's
   * @api public
   */
  equals: function (otherId){
    if (otherId instanceof ObjectId) {
      return this.toString() === otherId.toString();
    } else if (
      typeof otherId === 'string' &&
      ObjectId.isValid(otherId) &&
      otherId.length === 12 &&
      isBuffer(this.id)
    ) {
      return otherId === this.id.toString('binary');
    } else if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 24) {
      return otherId.toLowerCase() === this.toHexString();
    } else if (typeof otherId === 'string' && ObjectId.isValid(otherId) && otherId.length === 12) {
      return otherId === this.id;
    } else if (otherId != null && (otherId instanceof ObjectId || otherId.toHexString)) {
      return otherId.toHexString() === this.toHexString();
    } else {
      return false;
    }
  },

  /**
   * Returns the generation date (accurate up to the second) that this ID was generated.
   *
   * @return {Date} the generation date
   * @api public
   */
  getTimestamp: function(){
    var timestamp = new Date();
    var time;
    time = this.id.at(3) | (this.id.at(2) << 8) | (this.id.at(1) << 16) | (this.id.at(0) << 24);
    timestamp.setTime(Math.floor(time) * 1000);
    return timestamp;
  },

  /**
  * Generate a 12 byte id buffer used in ObjectId's
  *
  * @method
  * @param {number} [time] optional parameter allowing to pass in a second based timestamp.
  * @return {string} return the 12 byte id buffer string.
  */
  generate: function (time) {
    if ('number' !== typeof time) {
      time = ~~(Date.now() / 1000);
    }

    //keep it in the ring!
    time = parseInt(time, 10) % 0xFFFFFFFF;

    var inc = next();

    return new Uint8Array([
      ((time >> 24) & 0xFF),
      ((time >> 16) & 0xFF),
      ((time >> 8) & 0xFF),
      (time & 0xFF),
      ((MACHINE_ID >> 16) & 0xFF),
      ((MACHINE_ID >> 8) & 0xFF),
      (MACHINE_ID & 0xFF),
      ((pid >> 8) & 0xFF),
      (pid & 0xFF),
      ((inc >> 16) & 0xFF),
      ((inc >> 8) & 0xFF),
      (inc & 0xFF),
    ])
  },
};

const next = () => {
  return global_index = (global_index + 1) % 0xFFFFFF;
}

function hex(length, n) {
  n = n.toString(16);
  return (n.length===length)? n : "00000000".substring(n.length, length) + n;
}

const inspect = (Symbol && Symbol.for && Symbol.for('nodejs.util.inspect.custom')) || 'inspect';

/**
 * Converts to a string representation of this Id.
 *
 * @return {String} return the 24 byte hex string representation.
 * @api private
 */
ObjectId.prototype[inspect] = function() { return "ObjectId("+this+")" };
ObjectId.prototype[Symbol.for('@@mdb.bson.version')] = 7;
ObjectId.prototype[Symbol.for('@@mdb.bson.type')] = 'ObjectId';
ObjectId.prototype.toJSON = ObjectId.prototype.toHexString;
ObjectId.prototype.toString = ObjectId.prototype.toHexString;
