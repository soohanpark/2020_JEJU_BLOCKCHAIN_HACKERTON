const request = require('request');
const fs = require('fs');
const Caver = require('caver-js');
const crypto = require('./crypt.js');


var DEPLOYED_ABI = fs.readFileSync('./DEPLOYED_ABI', 'utf-8')
var DEPLOYED_ADDRESS = fs.readFileSync('./DEPLOYED_ADDRESS', 'utf-8')

var ADMIN_ADDRESS = 'INSERT ADMIN PUB_KEY'
var ADMIN_PRIVKEY = 'INSERT ADMIN PRIV_KEY'


const config = {
    rpcURL : 'https://api.baobab.klaytn.net:8651/'  // KLAYTN_TESTNET_BAOBAB
}
const caver = new Caver(config.rpcURL)
const myContract = new caver.contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
myContract.options.gasPrice = '25000000000'
myContract.options.gas = 5000000

const admin_keyring = caver.wallet.keyring.create(ADMIN_ADDRESS, ADMIN_PRIVKEY)
caver.wallet.add(admin_keyring)
console.log("Success to add ADMIN_KEYRING")


const pubKeyList = {}


const addr = {
	/**
	 * Generate wallet.  
	 * @param {string} _email
	 * @return 
	 */
    newWallet : function (_email) {
    	var newkeyRing = caver.wallet.keyring.generate()
    	pubKeyList[_email] = newkeyRing
    	caver.wallet.add(newkeyRing)
		
		console.log('GEN NEW WALLET')
		console.log('EMAIL: ' + _email + '  |  ADDR: ' + newkeyRing.address)
		console.log('SUCCESS')

    	return newkeyRing
    },


    getKeyRingFromEmail : function (_email) {
        return pubKeyList[_email]
    },


    getAllPubKeyList : function () {
        return pubKeyList
    },
}


const tx = {
	/**
	 * Set NDNS Data into Klaytn Network.  
	 * **_data**'s format => 제이슨으로 들어온거 string화 해서 저장해야할 듯 함
	 * @param {JSON} _data 
	 * @param {Function} callback 
	 */
	setData : function (_data, callback) {
		console.log("SETDATA START")
		console.log(_data)

		var temp = crypto.encrypt(_data)

		_data = JSON.stringify(temp)

		console.log('SETDATA CRYPTED')
		console.log(_data)

		myContract.methods.setData(_data).send({from : ADMIN_ADDRESS}).then(
			(res) => {
				callback(res.transactionHash)
			}
		)
	},


    getData : function (_txHash, callback) {
		const headers = {
			'x-chain-id': '1001',
			'Content-Type': 'application/json'
		}

		var options = {
			url: 'https://wallet-api.klaytnapi.com/v2/tx/' + _txHash,
			method: 'GET',
			headers: headers,
			auth: {
				'user': 'KAS_CREDENTIAL_ACCESSKEY_ID',
				'pass': 'KAS_CREDENTIAL_ACCESSKEY_PW'
			},
		}

		request(options, (err, resp, body) => {
			body = JSON.parse(body)
			//console.log('### body')
			console.log(body)
			console.log('### body.input')
			console.log(body.input)

			var v = caver.utils.hexToAscii(body.input)
			v = v.split('{')[1]
			v = v.split('}')[0]
			v = v.split(',')
			

			//console.log('VVVVV')
			console.log(v)

			c = {
				cipherText: v[0].split(':')[1].substring(1, v[0].split(':')[1].length-1),
				tag: v[1].split(':')[1].substring(1, v[1].split(':')[1].length-1),
				nonce: v[2].split(':')[1].substring(1, v[2].split(':')[1].length-1)
			}

			//console.log('CCC')
			console.log(c)

			var r = crypto.decrypt(c)

			//console.log('RRR')
			console.log(r)

			var j = JSON.parse(r)
			//console.log('JJJ')
			//console.log(j)

			callback(j)
		})

    },

	/**
	 * Reward to Users who verified data's owner.  
	 * **_data**'s format => *{email : count of verified data}*  
	 * @param {JSON} _data 
	 */
    reward : async function (_data) {
		const rewardVal = 0.001
		
		var keys = Object.keys(_data)
		
		console.log(keys)
		console.log(addr.getAllPubKeyList())

		console.log('START REWARD')
		for (i = 0; i < keys.length; i++) {
			console.log('SET PARAM')
			var email = keys[i]
			var value = caver.utils.toPeb((_data[email] * rewardVal).toString(), 'KLAY')
			console.log('email: ' + email)
			console.log('value: ' + value)

			var keyRing = addr.getKeyRingFromEmail(email)
			console.log()
			console.log(keyRing)
			console.log()
			
			console.log('addr: ' + keyRing.address)

			await this.rewarder(keyRing.address, value);
		}
		console.log('END REWARD')
    },


	rewarder : function (_address, _value) {
		return new Promise( (res) => {
			console.log('start rewarder')
			myContract.methods.reward(_address, _value).send({from:ADMIN_ADDRESS})
			.then(
				res
			)
		})
	}
}


const admin = {
    depositReward : function (_val) {
        myContract.methods.deposit().send({
            from : ADMIN_ADDRESS,
            value : caver.utils.toPeb(_val, 'KLAY')
        }).then( (res) => {
			console.log('##### depositReward #####')
			console.log(res)
		})
	},
	
}


exports.addr = addr
exports.tx = tx
exports.admin = admin
