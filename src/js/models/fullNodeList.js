'use strict';

/**
 * FullNodeList
 *
 * credential: array of OBJECTS
 */
function FullNodeList() {
  this.version = '1.0.0';
};

FullNodeList.create = function(opts) {
  opts = opts || {};

  var x = new FullNodeList();
  x.createdOn = Date.now();
  x.credentials = opts.credentials || [];
  x.disclaimerAccepted = false;
  x.checked = {};
  x.anonCoreDatadir = opts.anonCoreDatadir;
  x.anonCoreFullPath = opts.anonCoreFullPath;
  x.name = opts.name;
  x.default = opts.default;
  return x;
};

FullNodeList.fromObj = function(obj) {
  var x = new FullNodeList();

  x.createdOn = obj.createdOn;
  x.name = obj.name;
  x.anonCoreFullPath = obj.anonCoreFullPath;
  x.anonCoreDatadir = obj.anonCoreDatadir;
  x.default = obj.default || false;

  if (x.credentials[0] && typeof x.credentials[0] != 'object')
    throw ("credentials should be an object");

  return x;
};

FullNodeList.fromString = function(str) {
  return FullNodeList.fromObj(JSON.parse(str));
};

FullNodeList.prototype.toObj = function() {
  delete this.dirty;
  return JSON.stringify(this);
};


// FullNodeList.prototype.hasWallet = function(walletId) {
//   for (var i in this.credentials) {
//     var c = this.credentials[i];
//     if (c.walletId == walletId) return true;
//   };
//   return false;
// };

// FullNodeList.prototype.isChecked = function(ua, walletId) {
//   return !!(this.checkedUA == ua && this.checked[walletId]);
// };


// FullNodeList.prototype.isDeviceChecked = function(ua) {
//   return this.checkedUA == ua;
// };


// FullNodeList.prototype.setChecked = function(ua, walletId) {
//   if (this.checkedUA != ua) {
//     this.checkedUA = ua;
//     this.checked = {};
//   }
//   this.checked[walletId] = true;
//   this.dirty = true;
// };


// FullNodeList.prototype.addWallet = function(credentials) {
//   if (!credentials.walletId)
//     throw 'credentials must have .walletId';

//   if (this.hasWallet(credentials.walletId))
//     return false;

//   this.credentials.push(credentials);
//   this.dirty = true;
//   return true;
// };

// FullNodeList.prototype.updateWallet = function(credentials) {
//   if (!credentials.walletId)
//     throw 'credentials must have .walletId';

//   if (!this.hasWallet(credentials.walletId))
//     return false;

//   this.credentials = this.credentials.map(function(c) {
//     if(c.walletId != credentials.walletId ) {
//       return c;
//     } else {
//       return credentials
//     }
//   });

//   this.dirty = true;
//   return true;
// };

// FullNodeList.prototype.deleteWallet = function(walletId) {
//   if (!this.hasWallet(walletId))
//     return false;

//   this.credentials = this.credentials.filter(function(c) {
//     return c.walletId != walletId;
//   });

//   this.dirty = true;
//   return true;
// };
