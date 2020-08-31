const router = require('express').Router();
const applicationController = require('../controllers/index');

/**
 * @url '/admin'
 * @method 'GET'
 */
router.get('/', (req, res) => {
    let totalStudents, average, totalAmount;
    applicationController.getTotalStudents().then((res) => {
        totalStudents = res[0];
        return applicationController.getAverage();
    }).then((result) => {
        average = result[0];
        return applicationController.getTotalAmount();
    }).then((amount) => {
        totalAmount = amount[0];
        res.render('admin', {
            totalStudents,
            average,
            totalAmount
        });
    }).catch(() => {
        if (!totalStudents) { totalStudents = 0; }
        if (!average) { average = 0; }
        res.render('admin', {
            totalStudents,
            average,
            totalAmount: 0
        });
    });    
});

/**
 * @url '/admin/feedbacks'
 * @method 'GET'
 */
router.get('/feedbacks', (req,res) => {
    res.render('feedbacks');
});

/**
 * @url '/admin/allStudents'
 * @method 'GET'
 */
router.get('/allStudents', (req, res) => {
    applicationController.getAllStudents().then((result) => {
        res.json({
            'result': result
        }).status(200);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

/**
 * @url '/admin/pay'
 * @method 'GET'
 */
router.get('/pay', (req,res) => {
    applicationController.payInstructor().then((result) => {
        res.json({'result': result}).status(200);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

/**
 * @url '/admin/allFeedbacks'
 * @method 'GET'
 */
router.get('/allFeedbacks', (req, res) => {
    applicationController.getAllFeedbacks().then((result) => {
        res.json({
            'result': result
        }).status(200);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

/**
 * @url '/admin/openFeedback'
 * @method 'GET'
 */
router.get('/openFeedback', (req, res) => {
    applicationController.openFeedbackForm().then((result) => {
        res.json({
            'result': result
        }).status(200);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

/**
 * @url '/admin/totalStudents'
 * @method 'GET'
 */
router.get('/totalStudents', (req, res) => {
    applicationController.getTotalStudents().then((result) => {
        res.json({
            'totalStudents': result
        }).status(200);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

/**
 * @url '/admin/getFeedbackFlag'
 * @method 'GET'
 */
router.get('/getFeedbackFlag', (req,res) => {
    applicationController.getFeedbackFlag().then((result) => {
        res.json({
            'feedbackFlag': result
        }).status(200);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

module.exports = router;