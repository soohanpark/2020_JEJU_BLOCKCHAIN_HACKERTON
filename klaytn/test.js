const ndns = require('./real.js')

const LOG = console.log

var email01 = 'A'
var email02 = 'B'

async function tester() {
    // await LOG('##### DEPOSIT REWARD POOL')
    // await ndns.admin.depositReward('0.01')
    // await LOG()

    await LOG('##### ADD NEW WALLET (EMAIL : A)')
    await LOG(ndns.addr.newWallet(email01))
    await LOG()
    
    await LOG('##### ADD NEW WALLET (EMAIL : B)')
    await LOG(ndns.addr.newWallet(email02))
    await LOG()

    await LOG('##### CHECK WALLETs')
    await LOG(ndns.addr.getAllPubKeyList())
    await LOG()

    await LOG('##### SET DATA')
    
    var data = 'set data test'
    var txHash
    await ndns.tx.setData(data, (hash) => {
        txHash = hash
        LOG(txHash)
    })
    await LOG()

    await LOG('##### GET DATA')
    await ndns.tx.getData('0x50dad35112661dcd179882e0b254f3c4bc81437859a953961350d47c7aad4cf2')
    await LOG()

    await LOG('##### REWARD')
    var userData = {'A': 2, 'B': 3}
    await ndns.tx.reward(userData)
}

tester()