const crypto = require('crypto')

const key = KEY_VALUE

const nonce = crypto.randomBytes(12)

const aad = Buffer.from(AAD_VALUE, 'hex')

const cipher = crypto.createCipheriv('aes-128-ccm', key, nonce, {
    authTagLength: 16
})


function encrypt(_plainTextString) {
    cipher.setAAD(aad, {
        plaintextLength: Buffer.byteLength(_plainTextString)
    })

    const cipherText = cipher.update(_plainTextString, 'utf8')

    cipher.final()

    const tag = cipher.getAuthTag()

    return {
        cipherText: cipherText.toString('hex'),
        tag: tag.toString('hex'),
        nonce: nonce.toString('hex'),
    }
}


function decrypt(_data) {
    const nonce = Buffer.from(_data.nonce, 'hex')
    const cipherText = Buffer.from(_data.cipherText, 'hex')
    const tag = Buffer.from(_data.tag, 'hex')

    const decipher = crypto.createDecipheriv('aes-128-ccm', key, nonce, {
        authTagLength: 16
    })

    decipher.setAuthTag(tag);

    decipher.setAAD(aad, {
        plaintextLength: cipherText.length
    })

    const receivedPlainText = decipher.update(cipherText, null, 'utf8')

    try{
        decipher.final()
    }catch (err) {
        console.error(err)
        return;
    }

    return receivedPlainText
}

exports.encrypt = encrypt
exports.decrypt = decrypt