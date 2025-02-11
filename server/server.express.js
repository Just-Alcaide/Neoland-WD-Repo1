import express from 'express';
import bodyParser from 'body-parser';
import {db} from "./server.mongodb.js";
import {ObjectId} from "./server.mongodb.js";
import {Oauth2} from "./server.oauth.js";

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./Proyecto-final/src'));

//Require Auth//

function requireAuth (req, res, next) {
  if (req.headers.authorization === `Bearer ${Oauth2()}`) {
    next()
  } else {
    res.status(401).json({ error: 'No autorizado' });
  }
}

//===CRUFD USERS===//

app.post('/create/users', async (req, res) => {
  res.json(await db.users.create(req.body))
})

app.get('/read/users', async (req, res) => {
  res.json(await db.users.get())
})

app.put('/update/users/:id', async (req, res) => {
  res.json(await db.users.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/filter/users/:name', async (req, res) => {
  res.json(await db.users.get({ $text: { $search: req.params.name } }))
})

app.post('/validate/users', requireAuth, async (req, res) => {
  const user = await db.users.validate(req.body)
  if (user) {
    res.json({success: true})
  } else {
    res.status(401).json({success: false, message: 'Credenciales incorrectas'})
  }
})

app.delete('/delete/users/:id', requireAuth, async (req, res) => {
  res.json(await db.users.delete(req.params.id))
  //TODO: En adelante, tendrá que borrar datos del user en clubs, propuestas...
})

app.post('/login/users', async (req, res) => {
  const user = await db.users.validate(req.body)
  if (user) {
    user.token = Oauth2()
    delete user.password
    res.json(user);
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
})


//===CRUFD CLUBS===//
/**
 * @param {string} userId
 * 
 */
app.post('/create/clubs', requireAuth, async (req, res) => {
  const {userId, ...clubData} = req.body
  const userObjectId = ObjectId(userId);

  const newClub = await db.clubs.create({
    ...clubData,
    admins: [userObjectId],
    members: [userObjectId],
  });

  await db.users.update(userObjectId, { $push: { clubs: newClub._id } });

  res.json(newClub)
})

app.get('/read/clubs', async (req, res) => {
  res.json(await db.clubs.get())
})

app.put('/update/clubs/:id', async (req, res) => {
  res.json(await db.clubs.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/filter/clubs/:name', async (req, res) => {
  res.json(await db.clubs.get({ $text: { $search: req.params.name } }))
})

app.delete('/delete/clubs/:id', async (req, res) => {
  res.json(await db.clubs.delete(req.params.id))
})


//===CRUFD BOOKS===//

app.post('/create/books', async (req, res) => {
  res.json(await db.books.create(req.body))
})

app.get('/read/books', async (req, res) => {
  res.json(await db.books.get())
})

app.put('/update/books/:id', async (req, res) => {
  res.json(await db.books.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/filter/books/:name', async (req, res) => {
  res.json(await db.books.get({ $text: { $search: req.params.name } }))
})

app.delete('/delete/books/:id', async (req, res) => {
  res.json(await db.books.delete(req.params.id))
})


//===CRUFD MOVIES===//

app.post('/create/movies', async (req, res) => {
  res.json(await db.movies.create(req.body))
})

app.get('/read/movies', async (req, res) => {
  res.json(await db.movies.get())
})

app.put('/update/movies/:id', async (req, res) => {
  res.json(await db.movies.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/filter/movies/:name', async (req, res) => {
  res.json(await db.movies.get({ $text: { $search: req.params.name } }))
})

app.delete('/delete/movies/:id', async (req, res) => {
  res.json(await db.movies.delete(req.params.id))
})


//===CRUFD PROPOSALS===//

app.post('/create/proposals', async (req, res) => {
  res.json(await db.proposals.create(req.body))
})

app.get('/read/proposals', async (req, res) => {
  res.json(await db.proposals.get())
})

app.put('/update/proposals/:id', async (req, res) => {
  res.json(await db.proposals.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/filter/proposals/:name', async (req, res) => {
  res.json(await db.proposals.get({ $text: { $search: req.params.name } }))
})

app.delete('/delete/proposals/:id', async (req, res) => {
  res.json(await db.proposals.delete(req.params.id))
})


//===CRUFD VOTES===//

app.post('/create/votes', async (req, res) => {
  res.json(await db.votes.create(req.body))
})

app.get('/read/votes', async (req, res) => {
  res.json(await db.votes.get())
})

app.put('/update/votes/:id', async (req, res) => {
  res.json(await db.votes.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/filter/votes/:name', async (req, res) => {
  res.json(await db.votes.get({ $text: { $search: req.params.name } }))
})

app.delete('/delete/votes/:id', async (req, res) => {
  res.json(await db.votes.delete(req.params.id))
})


//===LISTEN PORT===//

app.listen(port, async () => {
  const users = await db.users.count();
  const clubs = await db.clubs.count();
  console.log(`Sophia Social listening on port ${port}: ${users} users and ${clubs} clubs`);
})