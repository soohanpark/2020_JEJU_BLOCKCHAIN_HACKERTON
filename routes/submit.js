const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const real = require('../klaytn/real.js');
// const { isTxHash } = require('caver-js/packages/caver-utils');

var lastTx;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('./css/style.css')); // 경로 static 설정
router.use(express.json());    // json parsing 용도

const datum = [
    {   
        buyer : "박수한",
        menu : "제주 흑돼지 고기",
        quantity: "5",
        price : "105000",
        date : "2020-09-11 19:11",
        card : "1",
        location : "",
        hashtag : "JMT",
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

const datum2 = {
    '725psh@naver.com' : 2,
    'harry4455@naver.com' : 4,
    'jisanglee@naver.com' : 3
}
    

const datum3 = {
    '725psh@naver.com' : [
        {
            buyer : "박수한",
            menu : "문어라면",
            quantity: "1",
            price : "1100",
            date : "2020-09-10 19:17",
            card : "2",
            location : "",
            hashtag : "바다의맛"
        },{
            buyer : "박수한",
            menu : "문어라면",
            quantity: "1",
            price : "1100",
            date : "2020-09-10 19:17",
            card : "2",
            location : "",
            hashtag : "바다의맛"
        }
    ],
    'harry4455@naver.com' : [
        {
            buyer : "박창현",
            menu : "문어라면",
            quantity: "1",
            price : "1100",
            date : "2020-09-08 19:17",
            card : "2",
            location : "",
            hashtag : "바다의맛"    
        }, {
            buyer : "박창현",
            menu : "연돈정식",
            quantity: "1",
            price : "1100",
            date : "2020-09-10 10:17",
            card : "3",
            location : "",
            hashtag : "천상의맛, JMT"
        }, {
            buyer : "박창현",
            menu : "제주 감귤 초콜릿",
            quantity: "3",
            price : "30000",
            date : "2020-09-16 18:17",
            card : "2",
            location : "",
            hashtag : "제주 명물"
        }, {
            buyer : "박창현",
            menu : "흑돼지",
            quantity: "5",
            price : "68000",
            date : "2020-09-20 23:17",
            card : "3",
            location : "",
            hashtag : "제주하면 흑돼지"
        }
    ],
    'jisanglee@naver.com' : [
        {
            buyer : "이지상",
            menu : "돈까스 정식",
            quantity: "1",
            price : "10100",
            date : "2020-09-11 19:17",
            card : "2",
            location : "",
            hashtag : "개꿀"    
        }, {
            buyer : "이지상",
            menu : "제주정식",
            quantity: "1",
            price : "10000",
            date : "2020-09-27 10:17",
            card : "8",
            location : "",
            hashtag : "JMT"
        }, {
            buyer : "이지상",
            menu : "돔베국수",
            quantity: "1",
            price : "13500",
            date : "2020-09-29 12:07",
            card : "8",
            location : "",
            hashtag : "제주조아"
        }
    ]
}

router.get('/', function(req, res, next) {
    console.log("HI THIS IS SUBMIT PAGE!");

    res.render("submit", {});
});

router.post('/receiver', function(req, res, next){
    console.log(res.body);
    console.log("HELLO POST IS HERE");

    var buyer = req.body.buyer;
    var menu = req.body.menu;
    var quantity = req.body.quantity;
    var price = req.body.price;
    var date = req.body.date;
    var card = req.body.card;
    var location = req.body.location;
    var hashtag = req.body.hashtag;

    console.log(req.body.card);

    res.redirect("/submit/contract");

});

router.get('/contract', function(req, res) {
    console.log("HI contract!");
    res.render("contract", {});
});

router.post('/api/datum', (req, res) => {
    const data = {
        id : req.body.id,
        buyer : req.body.buyer,
        menu : req.body.menu,
        quantity : req.body.quantity,
        price : req.body.price,
        date : req.body.date,
        card : req.body.card,
        location : req.body.location,
        hashtag : req.body.hashtag
    };

    datum.push(data);
    res.send(datum);

});

router.get('/api/send', function(req, res) {
    const data = datum3;
    const data2 = JSON.stringify(data);

    console.log('##### INPUT DATA');
    console.log(data);

    real.tx.setData(data2, function(hash){
        console.log("TX_HASH");
        console.log(hash);
        console.log()
        console.log('SUCCESS SET DATA')
        lastTx = hash;
        res.send(hash);
        //res.redirect('/submit');
    });
});


router.get('/api/lookup', function(req, res) {
    const data = lastTx;

    real.tx.getData(data, (rst) => {
        console.log("GET DATA FROM KLAYTN NETWORK BY TX");
        console.log(rst);
        console.log('SUCCESS GET DATA')
    });
    
    res.send('SUCCESS')
});


router.get('/api/rewards', function(req, res) {
    const data = datum2;

    real.tx.reward(data);
    console.log("SUCCESS REWARD FOR USER");

    res.send('SUCCESS')
})


module.exports = router;