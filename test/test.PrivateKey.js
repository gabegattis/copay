'use strict';

var chai = chai || require('chai');
var should = chai.should();
var bitcore = bitcore || require('bitcore');
var Transaction = bitcore.Transaction;
var buffertools = bitcore.buffertools;
var WalletKey = bitcore.WalletKey;
var Key = bitcore.Key;
var bignum = bitcore.Bignum;
var networks = bitcore.networks;
var Address = bitcore.Address;
var BitcorePrivateKey = bitcore.PrivateKey;
try {
  var copay = require('copay'); //browser
} catch (e) {
  var copay = require('../copay'); //node
}
var PrivateKey = copay.PrivateKey || require('../js/models/core/PrivateKey');

var config = {
  networkName: 'livenet',
};

describe('PrivateKey model', function() {

  it('should create an instance', function() {
    var w = new PrivateKey(config);
    should.exist(w);
    should.exist(w.bip);
    should.exist(w.bip.derive);
  });

  it('should derive priv keys', function() {
    var pk = new PrivateKey(config);
    for (var j = false; !j; j=true) {
      for (var i = 0; i < 3; i++) {
        var wk = pk.get(i, j);
        should.exist(wk);
        var o = wk.storeObj();
        should.exist(o);
        should.exist(o.priv);
        should.exist(o.pub);
        should.exist(o.addr);
        var a = new Address(o.addr);
        a.isValid().should.equal(true);
        (function() {
          var p = new PrivateKey(o.priv)
        }).should.not.throw();
      }
    }
  });
  it('should derive priv keys array', function() {
    var w = new PrivateKey(config);
    var wks = w.getAll(2, 3);
    wks.length.should.equal(5);
    for (var j = 0; j < wks.length; j++) {
      var wk = wks[j];
      should.exist(wk);
      var o = wk.storeObj();
      should.exist(o);
      should.exist(o.priv);
      should.exist(o.pub);
      should.exist(o.addr);
      var a = new Address(o.addr);
      a.isValid().should.equal(true);
      (function() {
        var p = new PrivateKey(o.priv)
      }).should.not.throw();
    }
  });

  it('fromObj toObj roundtrip', function() {
    var w1 = new PrivateKey(config);
    var o = JSON.parse(JSON.stringify(w1.toObj()))
    var w2 = PrivateKey.fromObj(o);

    w2.toObj().extendedPrivateKeyString.should.equal(w1.toObj().extendedPrivateKeyString);
    w2.getId().should.equal(w1.getId());

    JSON.stringify(w2.get(1, true).storeObj()).should
      .equal(JSON.stringify(w1.get(1, true).storeObj()));
    JSON.stringify(w2.get(1, false).storeObj()).should
      .equal(JSON.stringify(w1.get(1, false).storeObj()));
  });

  describe('#getId', function() {
    it('should calculate the copayerId', function() {
      var w1 = new PrivateKey(config);
      should.exist(w1.getId());
      w1.getId().length.should.equal(33 * 2);
    });
  });

  describe('#getIdPriv', function() {
    it('should calculate .id', function() {
      var w1 = new PrivateKey(config);
      should.exist(w1.getIdPriv());
      w1.getIdPriv().length.should.equal(32 * 2);
    });
  });

  describe('#cacheId', function() {
    it('should set .id and .idpriv', function() {
      var w1 = new PrivateKey(config);
      w1.cacheId();
      var pub = w1.id;
      var priv = w1.idpriv;
      pub.length.should.equal(33 * 2);
      priv.length.should.equal(32 * 2);
    });

    it('should set the id equal to the public key of the idpriv private key', function() {
      var w1 = new PrivateKey(config);
      w1.cacheId();
      var pub = w1.id;
      var priv = w1.idpriv;
      pub.length.should.equal(33 * 2);
      priv.length.should.equal(32 * 2);

      var key1 = new bitcore.Key();
      key1.private = new bitcore.Buffer(priv, 'hex');
      key1.regenerateSync();
      key1.public.toString('hex').should.equal(pub);
    });
  });

});
