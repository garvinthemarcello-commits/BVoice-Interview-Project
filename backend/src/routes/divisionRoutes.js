/**
 * Division routes — /api/divisions
 */

const express = require('express');
const { getAllDivisions, getDivisionById } = require('../controllers/divisionController');

const router = express.Router();

router.get('/',     getAllDivisions);
router.get('/:id',  getDivisionById);

module.exports = router;
