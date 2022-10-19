const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultipleFiles(page = 1, email){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, filename, description, createdTime, location FROM file_uploads WHERE email="${email}" LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,meta
  }
}

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT name, email, password FROM users LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,meta
  }
}




async function getUser(email){
  const rows = await db.query(
    `SELECT name, email FROM users WHERE email="${email}"`
  );
//	console.log(rows);
 //const data = helper.emptyOrRows(rows);
// var users = JSON.parse(data);
  return rows[0];
}


async function create(user){
  var post = [user.name, user.email, user.password];
  const result = await db.query(`INSERT INTO users (name, email, password) VALUES ("${user.name}", "${user.email}", "${user.password}")`);
  let message = 'Error in creating user';

  if (result.affectedRows) {
    message = 'User created successfully';
  }
  return {message};
}

async function exists(user){
  var post = [user.name, user.email, user.password];
  const row = await db.query(`SELECT * FROM users where email="${user.email}" and password="${user.password}"`);
  let message = false;
  if (row && row.length) {
    message = true;
  }
  return message;
}


async function saveFileRec(file){
  var datetime = new Date();
  const result = await db.query(`INSERT INTO file_uploads (filename, description, fileSize, location, email) VALUES ("${file.Key}", "${file.description}","${file.size}", "${file.Location}", "${file.email}")`);
  let message = 'Error in creating file';

  if (result.affectedRows) {
    message = 'File created successfully';
  }
  return {message};
}


async function editFileRec(file){
  var datetime = new Date();
  const result = await db.query(`UPDATE file_uploads SET filename ="${file.Key}", fileSize="${file.size}", location="${file.Location}" WHERE id = ${file.id}`);
  let message = 'Error in updating file';

  if (result.affectedRows) {
    message = 'File edited successfully';
  }
  return {message};
}



async function deleteFileRec(id){
  const row = await db.query(`DELETE FROM file_uploads where id=${id}`);
  let message = 'Error in deleting file record';

  if (row.affectedRows) {
    message = 'File record deleted successfully';
  }
  return {message};
}



module.exports = {
	getMultipleFiles,
	getMultiple,
        getUser,
	create,
	exists,
	saveFileRec,
	editFileRec,
	deleteFileRec
}
