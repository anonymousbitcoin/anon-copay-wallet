'use strict';

angular.module('copayApp.services').service('rpcService', function ($log, $rootScope, $http) {
    var RPC_commands = {
        /* Overall control/query calls */
        "getinfo": { args: [0] },
        "help": { args: [0] },

        /* P2P networking */
        "addnode": { args: [2] },
        "getnetworkinfo": { args: [0] },
        "disconnectnode": { args: [1] },
        "getaddednodeinfo": { args: [2] },
        "getconnectioncount": { args: [0] },
        "getnettotals": { args: [0] },
        "getpeerinfo": { args: [0] },
        "ping": { args: [0] },
        "setban": { args: [2, 3, 4] },
        "listbanned": { args: [0] },
        "clearbanned": { args: [0] },
         
        /* Block chain and UTXO */
        "getblockchaininfo": { args: [0] },
        "getbestblockhash": { args: [0] },
        "getblockcount": { args: [0] },
        "getblock": { args: [1, 2] },
        // "getblockdeltas": { args: [0] },  currently not supported (part of insight update)
        // "getblockhashes": { args: [2, 3] },
        "getblockhash": { args: [1] },
        "getblockheader": { args: [1, 2] },
        "getchaintips": { args: [0] },
        "getdifficulty": { args: [0] },
        "getmempoolinfo": { args: [0] },
        "getrawmempool": { args: [0, 1] },
        "gettxout": { args: [2, 3] },
        "gettxoutproof": { args: [2] },
        "verifytxoutproof": { args: [1, 2] },
        // "gettxoutsetinfo": { args: [0] },  currently not supported (part of insight update)
        "verifychain": { args: [0] },
        // "getspentinfo": { args: [0] }, currently not supported (part of insight update)

         /* Raw transactions */
        "createrawtransaction": { args: [3, 7] },
        "decoderawtransaction": { args: [1] },
        "decodescript": { args: [1] },
        "getrawtransaction": { args: [1, 2] },
        "sendrawtransaction": { args: [1, 2] },
        "signrawtransaction": { args: [1, 2, 3, 4] },

         /* Utility functions */
         "createmultisig": { args: [2] },
         "validateaddress": { args: [1] },
         "verifymessage": { args: [3] },
         "estimatefee": { args: [1] },
         "estimatepriority": { args: [1] },
         "z_validateaddress": { args: [1] },

         /* Dash features */
         "listmasternodes": { args: [0] },
         "listmasternodeconf": { args: [0] },
         "masternode": { args: [1, 2] },
         "masternodelist": { args: [0, 1, 2] },
         "masternodebroadcast": { args: [1] },
         "gobject": { args: [1, 2, 3] },
         "mnsync": { args: [1] },
         "getgovernanceinfo": { args: [0] },
         "voteraw": { args: [7] },

         /* Wallet */
        "addmultisigaddress": { args: [2] },
        "backupwallet": { args: [1] },
        "dumpprivkey": { args: [1] },
        "dumpwallet": { args: [1] },
        //"encryptwallet": { args: [0] },  currently not supported
        "getaccountaddress": { args: [1] },
        // "getaccount": { args: [0] },  DEPRECATED
        // "getaddressesbyaccount": { args: [0] }, DEPRECATED.
        // "getbalance": { args: [0] }, not accurate for z-coins, use z_gettotalbalance or z_getbalance instead
        "getnewaddress": { args: [0] },
        "getrawchangeaddress": { args: [0] },
        "getreceivedbyaccount": { args: [1, 2] }, //DEPRECATED don't rely on it
        "getreceivedbyaddress": { args: [1, 2] },
        "gettransaction": { args: [1, 2] },
        "getunconfirmedbalance": { args: [0] },
        "getwalletinfo": { args: [0] },
        "importprivkey": { args: [1, 2, 3] },
        "importwallet": { args: [1] },
        "importaddress": { args: [1, 2, 3] },
        "keypoolrefill": { args: [0] },
        "listaccounts": { args: [0] },
        "listaddressgroupings": { args: [0] },
        "listlockunspent": { args: [0] },
        "listreceivedbyaccount": { args: [0] },
        "listreceivedbyaddress": { args: [0] },
        "listsinceblock": { args: [0] }, //be careful, could be a large object - part of insight upgrade
        "listtransactions": { args: [0] },
        "listunspent": { args: [0] },
        "lockunspent": { args: [2] },
        "move": { args: [0] }, //DEPRECATED.
        "sendfrom": { args: [0] }, //DEPRECATED (use sendtoaddress).
        "sendmany": { args: [2, 3, 4, 5] },
        "sendtoaddress": { args: [2, 3, 4, 5] },
        "setaccount": { args: [0] }, //DEPRECATED.
        "settxfee": { args: [1] },
        "signmessage": { args: [2] },
        // "walletlock": { args: [0] }, can be only called when wallet is encrypted; wallet encryption isn't supported
        // "walletpassphrasechange": { args: [0] },  can be only called when wallet is encrypted; wallet encryption isn't supported
        // "walletpassphrase": { args: [0] },  can be only called when wallet is encrypted; wallet encryption isn't supported
        // "zcbenchmark": { args: [0] }, probably never going to be used
        "zcrawkeygen": { args: [0] },
        // "zcrawjoinsplit": { args: [0] }, DEPRECATED.
        "zcrawreceive": { args: [0] }, //DEPRECATED.
        "zcsamplejoinsplit": { args: [0] },
        "z_listreceivedbyaddress": { args: [1, 2] },
        "z_getbalance": { args: [1, 2] },
        "z_gettotalbalance": { args: [0] },
        "z_sendmany": { args: [2, 3, 4] },
        "z_shieldcoinbase": { args: [0] },
        "z_getoperationstatus": { args: [2, 3] },
        "z_getoperationresult": { args: [0] },
        "z_listoperationids": { args: [0] },
        "z_getnewaddress": { args: [0] },
        "z_listaddresses": { args: [0] },
        "z_exportkey": { args: [1] },
        "z_importkey": { args: [1, 2, 3] },
        "z_exportwallet": { args: [1] },
        "z_importwallet": { args: [1] }
    }
    var callRPCLocalhost = function(cmd, args, callback) {
        // use $.param jQuery function to serialize data from JSON 
        var data = {
          "method": cmd
        };
        var config = {
          headers: {
            'Content-Type': 'application/json'
          }
        } 

        //append arguments if exist
        if(args.length){
            data['params'] = [];
            for(let i = 0; i < args.length; i++){
                data['params'].push(args[i]);
            }
        }
        
        //setup basic authorization
        $http.defaults.headers.common.Authorization = 'Basic ' + btoa($rootScope.RPCusername + ":" + $rootScope.RPCpassword);
  
        $http.post('http://localhost:3130', data, config)
          .success(function (data, status, headers, config) {
            // $log.debug(data.result);
            // $log.debug("status:", status);
            if(status != 200)
                return callback(status);
            return callback(null, data)
          })
          .error(function (data, status, header, config) {
            // $log.debug(data);'
            // $log.debug("status:", status);
            // $log.debug(header);
            // $log.debug(config);
            return callback(status)
          });
      }

    var isRPCcommandSupported = function(command, args){

        //check if the provided RPC command in our list
        if(RPC_commands[command]){
            //check if this RPC command supports the provided number of arguments
            for(let i = 0; i < RPC_commands[command]['args'].length; i++){
                if(RPC_commands[command]['args'][i] === args.length){
                    //command and arguments are supported
                    return true;
                }
            }
            //doesn't support the number of provided arguments
            return false;
        } else { 
            //doesn't support the provided command
            return false;
        }
    }

    /*
    returns (err,res)
    
    Example: 
    callRPC("command", [array of arguments], callback function)
    
    *Note: if you are calling RPC command that doesn't take any arguments you need to pass 'null' as second parameter, see example below
    callRPC("getinfo", null, callback)
    
    *get information about block #3
    callRPC("getblock", ["3"], callback)
    
    *filter list of masternode by lastseen
    callRPC("masternode", ["list", "lastseen"], callback)
    */
   
    this.callRPCService = function(cmd, args, cb){
        // $log.debug("cmd : ", cmd);
        // $log.debug("args : ", args);
        
        //handle no arguments case
        if(!args)
            args = [];

        //make sure the command and number of args are supported
        if(!isRPCcommandSupported(cmd, args, cb))
            return cb("RPC command or number of arguments aren't supported");
        // $log.debug("Command is supported");

        callRPCLocalhost(cmd, args, function(err, res){
            if(err)
                return cb(err);
            
            // $log.debug("Called RPC successfully");
            return cb(null, res)
        });
    }

  //end of service
});
