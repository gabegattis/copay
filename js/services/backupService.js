'use strict';


var BackupService = function(notification) {
  this.notifications = notification;
};

BackupService.prototype.getName = function(wallet) {
  return (wallet.name ? (wallet.name + '-') : '') + wallet.id;
};

BackupService.prototype.download = function(wallet) {
  var ew = wallet.toEncryptedObj();
  var timestamp = +(new Date());
  var walletName = this.getName(wallet);
  var filename = walletName + '-' + timestamp + '-keybackup.json.aes';
  this.notifications.success('Backup created', 'Encrypted backup file saved.');
  var blob = new Blob([ew], {
    type: 'text/plain;charset=utf-8'
  });
  // show a native save dialog if we are in the shell
  // and pass the wallet to the shell to convert to node Buffer
  if (window.cshell) {
    return window.cshell.send('backup:download', {
      name: walletName,
      wallet: ew
    });
  }
  // otherwise lean on the browser implementation
  saveAs(blob, filename);
};

angular.module('copayApp.services').service('backupService', BackupService);
