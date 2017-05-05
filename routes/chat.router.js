const express = require('express');
const router = express.Router();

router.get('chat/:id', (req, res) => {
    console.log(req.params.id);
    res.send('Holas');
});

module.exports = router;