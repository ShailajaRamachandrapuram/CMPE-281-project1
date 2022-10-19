const express = require('express');
const path = require('path');
const router = express.Router();
const programmingLanguages = require('../services/services');


const upload = require("../common");
const { uploadFile, getFileStream } = require("../s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);


/* GET programming languages. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting users`, err.message);
    next(err);
  }
});


router.get('/user', async function(req, res, next) {
  try {
	  var prm1 = req.query.email;
	  if(typeof prm1 != 'undefined'){
            res.json(await programmingLanguages.getUser(decodeURI(prm1)));
	  } else {
	    res.sendFile(path.join(__dirname, '../public', 'index.html'));
	  }
  } catch (err) {
    console.error(`Error while getting users`, err.message);
    next(err);
  }
});


router.post('/login', async function(req, res, next) {
  try {
	  var response = await programmingLanguages.exists(req.body);
	  if(response){
		res.cookie('email',req.body.email);
		res.sendFile(path.join(__dirname, '../public', 'files.html'));
	  } else {
		res.cookie('email','');
	  	res.sendFile(path.join(__dirname, '../public', 'index.html'));
	  }
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    res.json(await programmingLanguages.create(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});


router.get('/user/files', async function(req, res, next) {
  try {
          var prm1 = req.query.email;
          if(typeof prm1 != 'undefined'){
            res.json(await programmingLanguages.getMultipleFiles(req.query.page, decodeURI(prm1)));
          } else {
            res.sendFile(path.join(__dirname, '../public', 'index.html'));
          }
  } catch (err) {
    console.error(`Error while getting users`, err.message);
    next(err);
  }
});

router.post('/user/file/upload', upload.single("file"), async function(req, res, next){
	try{
		console.log('here >>> file upload >>');
	  // uploading to AWS S3
		const result = await uploadFile(req.file);
		result.description = req.body.description;
		result.size = req.file.size + ' bytes';
		result.email =  req.body.email;
		var storedb =  await programmingLanguages.saveFileRec(result);
	        console.log("S3 response", result);
		await unlinkFile(req.file.path);
		console.log({ status: "success", message: "File uploaded successfully", data: req.file});
		res.sendFile(path.join(__dirname, '../public', 'files.html'));
	 } catch (err) {
		console.error(`Error while getting users`, err.message);
	 	next(err);
	 }
});

router.post('/user/file/edit', upload.single("file"), async function(req, res, next){
        try{
                console.log('here >>> file edit >>');
          // uploading to AWS S3
                const result = await uploadFile(req.file);
                result.size = req.file.size + ' bytes';
		result.id = req.query.id;
                var storedb =  await programmingLanguages.editFileRec(result);
                console.log("S3 response", result);
                await unlinkFile(req.file.path);
                console.log({ status: "success", message: "File uploaded successfully", data: req.file});
                res.sendFile(path.join(__dirname, '../public', 'files.html'));
         } catch (err) {
                console.error(`Error while getting users`, err.message);
                next(err);
         }
});

router.post('/user/file/delete', async function(req, res, next){
        try{
		 var deletedb =  await programmingLanguages.deleteFileRec(req.query.id);
		 
                 console.log("Deleted file record", deletedb);

		 res.sendFile(path.join(__dirname, '../public', 'files.html'));

         } catch (err) {
                console.error(`Error while getting users`, err.message);
                next(err);
         }
});



module.exports = router;
