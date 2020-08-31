const router = require('express').Router();
const applicationController = require('../controllers/index');

/**
 * @url '/'
 * @method 'GET'
 */
router.get('/', (req, res) => {
    res.render('registerStudent');
});

/**
 * @url '/giveFeedback'
 * @method 'GET'
 */
router.get('/giveFeedback', (req,res) => {
    res.render('giveFeedback');
});

/**
 * @url '/end'
 * @method 'GET'
 */
router.get('/end', (req,res) => {
    res.render('end');
});

/**
 * @url '/register'
 * @method 'POST'
 */
router.post('/register', (req, res) => {
    applicationController.registerStudent(req.body).then((result) => {
        res.json({'result': result}).status(200);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

/**
 * @url '/giveFeedback'
 * @method 'POST'
 */
router.post('/giveFeedback', (req, res) => {
    applicationController.giveSessionFeedback(req.body).then((result) => {
        res.json({'result': result}).status(200);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

module.exports = router;