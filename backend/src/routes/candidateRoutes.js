/**
 * Candidate routes — /api/candidates
 */

const express = require('express');
const { getAllCandidates, getCandidateByNim } = require('../controllers/candidateController');

const router = express.Router();

router.get('/',        getAllCandidates);
router.get('/:nim',    getCandidateByNim);

module.exports = router;
