const express = require('express');
const router = express.Router();
const real = require('../klaytn/real.js');


const datum = [
    {   
        buyer : "박수한",
        menu : "제주 흑돼지 고기",
        quantity: "5",
        price : "105000",
        date : "2020-09-11 19:11",
        card : "1",
        location : "",
        hashtag : "JMT"
    },
    {
        buyer : "박수한",
        menu : "얀돈 정식세트",
        quantity: "1",
        price : "12500",
        date : "2020-09-10 13:09",
        card : "2",
        location : "",
        hashtag : "돈까스맛집"
    },
    {
        buyer : "박수한",
        menu : "문어라면",
        quantity: "1",
        price : "1100",
        date : "2020-09-10 19:17",
        card : "2",
        location : "",
        hashtag : "바다의맛"
    }
];


router.get('/', function(req, res, next) {
    console.log("HI THIS IS USER PAGE!");

    res.render("users", {});
});

router.get('/api/datum', (req, res) => {
    res.send(datum);
});

router.get('/api/datum/:id', (req, res) => {
    const data = datum.find(d => d.id === parseInt(req.params.id))
    if(!datum) res.status(404).send('해당 id의 결제건이 존재하지 않습니다.');
    res.send(data);
});

router.get('/api/newWallet', function(req, res) {
    
    real.addr.newWallet("harry4455@naver.com");
    real.addr.newWallet("725psh@naver.com");
    real.addr.newWallet("jisanglee@naver.com");
    //console.log("NEW WALLET TEST");

    res.send('SUCCESS')
})



module.exports = router;