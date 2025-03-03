import express, { Router } from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';
import { MongoClient, ObjectId } from "mongodb";


const URI = process.env.MONGO_ATLAS;
const api = express();
const router = Router();

//EXPRESS.JS

//Require Auth//

function requireAuth (req, res, next) {
  if (req.headers.authorization === `Bearer ${Oauth2()}`) {
    next()
  } else {
    res.status(401).json({ error: 'No autorizado' });
  }
}

//===USERS===//

router.post('/create/users', async (req, res) => {
  const newUser = await db.users.create(req.body);
  if (newUser.error) {
    return res.status(400).json({ message: newUser.error });
  }
  res.json(newUser)
})

router.get('/read/users', async (req, res) => {
  res.json(await db.users.get())
})

router.post('/read/users', async (req, res) => {
  const {ids} = req.body;
  const users = await db.users.getByIds(ids);
  res.json(users);
})

router.put('/update/users/:id', async (req, res) => {
  res.json(await db.users.update(req.params.id, req.body))
})

router.get('/filter/users/:name', async (req, res) => {
  res.json(await db.users.get({ $text: { $search: req.params.name } }))
})

router.post('/validate/users', requireAuth, async (req, res) => {
  const user = await db.users.validate(req.body)
  if (user) {
    res.json({success: true})
  } else {
    res.status(401).json({success: false, message: 'Credenciales incorrectas'})
  }
})

router.delete('/delete/users/:id', requireAuth, async (req, res) => {
  res.json(await db.users.delete(req.params.id))

})

router.post('/login/users', async (req, res) => {
  const user = await db.users.validate(req.body)
  if (user) {
    user.token = Oauth2()
    res.json(user);
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
})


//===CLUBS===//

router.post('/create/clubs', requireAuth, async (req, res) => {
  const {userId, ...clubData} = req.body
  const newClub = await db.clubs.create(clubData, userId);
  res.json(newClub)
})

router.get('/read/clubs', async (req, res) => {
  res.json(await db.clubs.get())
})

router.get('/read/clubs/:id', async (req, res) => {
  res.json(await db.clubs.getById(req.params.id))
})

router.post('/read/clubs', async (req, res) => {
  const {type} = req.body;
  res.json(await db.clubs.getByType(type));
})

router.put('/update/clubs/:id', requireAuth, async (req, res) => {
  const clubId = req.params.id;
  const updates = req.body;

  const updatedClub = await db.clubs.update(clubId, updates);
  res.json(updatedClub);
})

router.put('/update/clubs/:id/admins', requireAuth, async (req, res) => {
  const clubId = req.params.id;
  const { userId } = req.body;

  const updatedClub = await db.clubs.addAdmin(clubId, userId);
  res.json(updatedClub);
})

router.put('/join/clubs/:id', async (req, res) => {
  const clubId = req.params.id
  const { userId, password } = req.body

  console.log("Recibido en Express:", { clubId, userId, password });

  if (!clubId || clubId.length !== 24 || !userId || userId.length !== 24) {
    return res.status(400).json({ success: false, message: "ID de club o usuario inválido" });
  }

  try {
    const updatedClub = await db.clubs.join(clubId, userId);
    console.log("Se unió correctamente:", updatedClub);
    res.json(updatedClub);
  } catch (error) {
    console.error("Error en joinClub:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

router.put('/leave/clubs/:id', async (req, res) => {
  const clubId = req.params.id
  const userId = req.body.userId

  const updatedClub = await db.clubs.leave(clubId, userId);
  res.json(updatedClub);
})

router.get('/filter/clubs/:name', async (req, res) => {
  res.json(await db.clubs.getByName(req.params.name));
})

router.delete('/delete/clubs/:clubId/:userId', requireAuth, async (req, res) => {
  const {clubId, userId} = req.params;

  const result = await db.clubs.delete(clubId, userId);
  res.json(result);
});


router.post('/create/books', async (req, res) => {
  res.json(await db.books.create(req.body))
})

router.get('/read/books', async (req, res) => {
  res.json(await db.books.get())
})

router.put('/update/books/:id', async (req, res) => {
  res.json(await db.books.update(req.params.id, req.body))
})

router.get('/filter/books/:name', async (req, res) => {
  res.json(await db.books.get({ $text: { $search: req.params.name } }))
})

router.delete('/delete/books/:id', async (req, res) => {
  res.json(await db.books.delete(req.params.id))
})


router.post('/create/movies', async (req, res) => {
  res.json(await db.movies.create(req.body))
})

router.get('/read/movies', async (req, res) => {
  res.json(await db.movies.get())
})

router.put('/update/movies/:id', async (req, res) => {
  res.json(await db.movies.update(req.params.id, req.body))
})

router.get('/filter/movies/:name', async (req, res) => {
  res.json(await db.movies.get({ $text: { $search: req.params.name } }))
})

router.delete('/delete/movies/:id', async (req, res) => {
  res.json(await db.movies.delete(req.params.id))
})


//===PROPOSALS===//

router.post('/create/proposals', async (req, res) => {
  const newProposal = await db.proposals.create(req.body);
  res.json(newProposal);
})

router.get('/read/proposals', async (req, res) => {
  res.json(await db.proposals.get())
})

router.post('/read/proposals', async (req, res) => {
  const {ids} = req.body;
  const proposals = await db.proposals.getByIds(ids);
  res.json(proposals);
})

router.put('/update/proposals/:id', async (req, res) => {
  res.json(await db.proposals.update(req.params.id, req.body))
})

router.get('/filter/proposals/:name', async (req, res) => {
  res.json(await db.proposals.get({ $text: { $search: req.params.name } }))
})

router.delete('/delete/proposals/:id', async (req, res) => {
  res.json(await db.proposals.delete(req.params.id))
})


//===VOTES===//

router.post('/create/votes', async (req, res) => {
  let { proposalId, userId } = req.body;

  if (!proposalId || !userId) {
    return res.status(400).json({ success: false, message: "ID de propuesta o usuario inválido" });
  }

  try {
    proposalId = new ObjectId(String(proposalId));
    userId = new ObjectId(String(userId));

    const alreadyVoted = await db.votes.get({ proposalId, userId });

    if (alreadyVoted.length > 0) {
      return res.status(400).json({ success: false, message: "El usuario ya ha votado esta propuesta" });
    }

    const newVote = await db.votes.create({ proposalId, userId });
    await db.proposals.vote(proposalId);
    res.json(newVote);

  } catch (error) {
    console.error( "Error al registrar el voto:", error);
    res.status(500).json({ success: false, message: "Error al registrar el voto" });
  }
})

router.get('/read/votes', async (req, res) => {
  res.json(await db.votes.get())
})

router.post('/read/votes', async (req, res) => {
  const {user_id} = req.body;
  const userVotes = await db.votes.getByUser(user_id);
  res.json(userVotes);
});

router.put('/update/votes/:id', async (req, res) => {
  res.json(await db.votes.update(req.params.id, req.body))
})

router.get('/filter/votes/:name', async (req, res) => {
  res.json(await db.votes.get({ $text: { $search: req.params.name } }))
})

router.delete('/delete/votes/:id', async (req, res) => {
  res.json(await db.votes.delete(req.params.id))
})



// for parsing application/json
api.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }))
api.use('/api/', router)

export const handler = serverless(api);



//MONGODB.JS


export const db = {
    users: {
        create: createUser,
        count: countUsers,
        get: getUsers,
        getByIds: getUserByIds,
        update: updateUser,
        delete: deleteUser,
        validate: validateUser,
    },
    clubs: {
        create: createClub,
        count: countClubs,
        get: getClubs,
        getById: getClubById,
        getByType: getClubsByType,
        getByName: getClubsByName,
        update: updateClub,
        addAdmin: addAdmin,
        join: joinClub,
        leave: leaveClub,
        delete: deleteClub,
    },
    books: {
        create: createBook,
        count: countBooks,
        get: getBooks,
        update: updateBook,
        delete: deleteBook,
    },
    movies: {
        create: createMovie,
        count: countMovies,
        get: getMovies,
        update: updateMovie,
        delete: deleteMovie,
    },
    proposals: {
        create: createProposal,
        count: countProposals,
        get: getProposals,
        getByIds: getProposalsByIds,
        update: updateProposal,
        vote: voteProposal,
        delete: deleteProposal,
    },
    votes: {
        create: createVote,
        count: countVotes,
        get: getVotes,
        getByUser: getVotesByUser,
        update: updateVote,
        delete: deleteVote,
    },
    ratings: {
        create: createRating,
        count: countRatings,
        get: getRatings,
        update: updateRating,
        delete: deleteRating,
    },
}


//===CRUD USERS===//

/**
 * Creates a new user in the database.
 * @param {Object} user - The user object containing user details.
 * @returns {Promise<Object>} The user object that was inserted into the database.
 */
async function createUser(user) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const usersCollection = SophiaSocialDB.collection('users');

    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
        return {error: 'El email ya existe'};
    } 

    const returnValue = await usersCollection.insertOne(user);
    console.log('db createUser', returnValue, user);
    return user;
}

/**
 * Retrieves the total number of users in the database.
 * @returns {Promise<number>} The total number of users in the database.
 */
async function countUsers() {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const usersCollection = SophiaSocialDB.collection('users');
    return await usersCollection.countDocuments();
}

/**
 * Retrieves a list of users from the database.
 * @param {Object} [filter] - Optional filter object to narrow down the results.
 * @returns {Promise<Object[]>} An array of user objects, or an empty array if no users match the filter.
 */
async function getUsers(filter) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const usersCollection = SophiaSocialDB.collection('users');
    return await usersCollection.find(filter).toArray();
}

async function getUserByIds (ids) {
    const client = new MongoClient(URI);
    const SophiaSocialDB = client.db('SophiaSocial');
    const usersCollection = SophiaSocialDB.collection('users');

    const objectIds = ids.map(id => new ObjectId(String(id)));

    return await usersCollection.find({_id: {$in: objectIds}}).toArray();
}

/**
 * Updates a user in the database.
 * @param {string} id - The ID of the user to be updated.
 * @param {Object} updates - An object containing the fields to update and their new values.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateUser(id, updates) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const usersCollection = SophiaSocialDB.collection('users');

    const updateQuery = Object.keys(updates).some(key => key.startsWith('$')) ? updates : { $set: updates };
    const returnValue = await usersCollection.updateOne({ _id: new ObjectId(String(id))}, updateQuery);

    console.log('db updateUser', returnValue, id, updates);
    return returnValue;
}

/**
 * Deletes a user from the database.
 * @param {string} id - The ID of the user to be deleted.
 * @returns {Promise<string>} The ID of the deleted user.
 */
async function deleteUser(id) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const usersCollection = SophiaSocialDB.collection('users');
    const votesCollection = SophiaSocialDB.collection('votes');
    const proposalsCollection = SophiaSocialDB.collection('proposals');
    const clubsCollection = SophiaSocialDB.collection('clubs');

    await votesCollection.deleteMany({ userId: new ObjectId(id) });
    await proposalsCollection.deleteMany({ userId: new ObjectId(id) });
    await clubsCollection.updateMany(
        {},
        { $pull: { members: new ObjectId(id), admins: new ObjectId(id) } }
    );
    const userDeleteResult = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    return userDeleteResult
}

/**
 * Retrieves a user from the database by their email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object|null>} The user object if found, or null if the user does not exist.
 */
async function validateUser({email, password}) {
    const client = new MongoClient(URI);
    const SophiaSocialDB = client.db('SophiaSocial');
    const usersCollection = SophiaSocialDB.collection('users');
    const user = await usersCollection.findOne({ email, password });
    if (!user) return null
    delete user.password
    return user
}

//===CRUD CLUBS===//

/**
 * Creates a new club in the database.
 * @param {Object} club - The club data to be inserted.
 * @returns {Promise<Object>} The created club object.
 */
async function createClub(clubData, userId) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const clubsCollection = SophiaSocialDB.collection('clubs');
    const usersCollection = SophiaSocialDB.collection('users');

    const userObjectId = new ObjectId(String(userId));

    const clubToCreate = {
        ...clubData, 
        admins: [userObjectId], 
        members: [userObjectId]
    };

    const returnValue = await clubsCollection.insertOne(clubToCreate);
    const newClub = {...clubToCreate, _id: returnValue.insertedId};

    await usersCollection.updateOne({ _id: userObjectId}, { $push: { clubs: newClub._id } });

    console.log('db createClub', newClub);
    return newClub;
}

/**
 * Retrieves the total number of clubs in the database.
 * @returns {Promise<number>} The total number of clubs.
 */
async function countClubs() {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const clubsCollection = SophiaSocialDB.collection('clubs');
    return await clubsCollection.countDocuments();
}

/**
 * Retrieves a list of clubs from the database.
 * @param {Object} [filter] - Optional filter object to narrow down the results.
 * @returns {Promise<Object[]>} An array of club objects, or an empty array if no clubs match the filter.
 */

async function getClubs(filter) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const clubsCollection = SophiaSocialDB.collection('clubs');
    return await clubsCollection.find(filter).toArray();
}

/**
 * Retrieves a club from the database by its id.
 * @param {string} id - The ObjectID of the club to retrieve.
 * @returns {Promise<Object|null>} The club object if found, or null if the club does not exist.
 */
async function getClubById(id) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const clubsCollection = SophiaSocialDB.collection('clubs');
    return await clubsCollection.findOne({ _id: new ObjectId(String(id)) });
}

async function getClubsByType(type){
    const client = new MongoClient(URI);
    const SophiaSocialDB = client.db('SophiaSocial');
    const clubsCollection = SophiaSocialDB.collection('clubs');

    const query = type ? {type: type} : {};
    const clubs = await clubsCollection.find(query).toArray();

    console.log('db getClubsByType', clubs);
    return clubs;
}

async function getClubsByName(name){
    const client = new MongoClient(URI);
    const SophiaSocialDB = client.db('SophiaSocial');
    const clubsCollection = SophiaSocialDB.collection('clubs');

    const clubs = await clubsCollection.find({ $text: { $search: name } }).toArray();
    
    return clubs;
}

/**
 * Updates a club with the provided _id.
 * @param {string} id - The ObjectID of the club to update.
 * @param {Object} updates - The fields to update and their new values.
 * @returns {Promise<Object>} The result from the MongoDB update operation.
 */
async function updateClub(id, updates) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const clubsCollection = SophiaSocialDB.collection('clubs');

    const updateQuery = Object.keys(updates).some(key => key.startsWith('$')) ? updates : { $set: updates };
    const returnValue = await clubsCollection.updateOne({ _id: new ObjectId(String(id))}, updateQuery);

    console.log('db updateClub', returnValue, id, updates);
    return returnValue;
}

async function addAdmin(clubId, userId) {
    const client = new MongoClient(URI);
    const SophiaSocialDB = client.db('SophiaSocial');
    const clubsCollection = SophiaSocialDB.collection('clubs');
    
    await clubsCollection.updateOne(
        { _id: new ObjectId(String(clubId)) },
        { $addToSet: { admins: new ObjectId(String(userId)) } }
    );
    
    const updatedClub = await clubsCollection.findOne({ _id: new ObjectId(String(clubId)) });
    return updatedClub;
}

async function joinClub(clubId, userId) {
    const client = new MongoClient(URI);
    const SophiaSocialDB = client.db('SophiaSocial');
    const clubsCollection = SophiaSocialDB.collection('clubs');
    const usersCollection = SophiaSocialDB.collection('users');

    try {
        if (!ObjectId.isValid(clubId) || !ObjectId.isValid(userId)) {
            throw new Error("ID de usuario o club inválido.");
        }

        const userObjectId = new ObjectId(userId);
        const clubObjectId = new ObjectId(clubId);

        const updatedClub = await clubsCollection.updateOne(
            { _id: clubObjectId },
            { $addToSet: { members: userObjectId } }
        );

        const updatedUser = await usersCollection.updateOne(
            { _id: userObjectId },
            { $addToSet: { clubs: clubObjectId } }
        );

        console.log('db joinClub:', updatedClub, updatedUser);
        return updatedClub;
    } catch (error) {
        console.error("Error en joinClub:", error);
        return { success: false, message: "Error al unirse al club" };
    }
}

async function leaveClub(clubId, userId) {
    const client = new MongoClient(URI);
    const SophiaSocialDB = client.db('SophiaSocial');
    const clubsCollection = SophiaSocialDB.collection('clubs');
    const usersCollection = SophiaSocialDB.collection('users');

    const userObjectId = new ObjectId(String(userId));
    const clubObjectId = new ObjectId(String(clubId));

    const updatedClub = await clubsCollection.updateOne({ _id: clubObjectId}, { $pull: {members: userObjectId}});

    const updatedUser = await usersCollection.updateOne({ _id: userObjectId}, {$pull: {clubs: clubObjectId}});

    console.log('db leaveClub', updatedClub, updatedUser);
    return updatedClub;
}

/**
 * Deletes a club from the database.
 * @param {string} id - The ID of the club to be deleted.
 * @returns {Promise<string>} The ID of the deleted club.
 */
async function deleteClub(clubId, userId) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');

    const clubsCollection = SophiaSocialDB.collection('clubs');
    const usersCollection = SophiaSocialDB.collection('users');
    const proposalsCollection = SophiaSocialDB.collection('proposals');
    const votesCollection = SophiaSocialDB.collection('votes');

    const club = await clubsCollection.findOne({ _id: new ObjectId(String(clubId)) });
    if (!club.admins.some(adminId => adminId.toString() === userId)) {
        return { success: false };
    }
    
    const clubProposals = await proposalsCollection.find({ clubId: new ObjectId(String(clubId)) }).toArray();
    const proposalIds = clubProposals.map(proposal => new ObjectId(String(proposal._id))); 

    if (proposalIds.length > 0) {
        const votesToDelete = await votesCollection.find({ proposalId: { $in: proposalIds } }).toArray();
        const voteIds = votesToDelete.map(vote => vote._id); 

        await usersCollection.updateMany(
            { votes: { $in: voteIds } },
            { $pull: { votes: { $in: voteIds } } }
        );

        await votesCollection.deleteMany({ _id: { $in: voteIds } });

        await usersCollection.updateMany(
            { proposals: { $in: proposalIds } },
            { $pull: { proposals: { $in: proposalIds } } }
        );

        await proposalsCollection.deleteMany({ clubId: new ObjectId(clubId) });
    }

    await usersCollection.updateMany(
        { _id: { $in: club.members.map(id => new ObjectId(String(id))) } },
        { $pull: { clubs: new ObjectId(String(clubId)) } }
    );

    const clubDeleteResult = await clubsCollection.deleteOne({ _id: new ObjectId(String(clubId)) });

    return clubDeleteResult;
}

//===CRUD BOOKS===//

/**
 * Creates a new book in the database.
 * @param {Object} book - The book data to be inserted.
 * @returns {Promise<Object>} The created book object.
 */
async function createBook(book) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const booksCollection = SophiaSocialDB.collection('books');
    const returnValue = await booksCollection.insertOne(book);
    console.log('db createBook', returnValue, book._id);
    return book;
}

/**
 * Retrieves the total number of books in the database.
 * @returns {Promise<number>} The total number of books in the database.
 */
async function countBooks() {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const booksCollection = SophiaSocialDB.collection('books');
    return await booksCollection.countDocuments();
}

/**
 * Retrieves a list of books from the database.
 * @param {Object} [filter] - Optional filter object to narrow down the results.
 * @returns {Promise<Object[]>} An array of book objects, or an empty array if no books match the filter.
 */
async function getBooks(filter) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const booksCollection = SophiaSocialDB.collection('books');
    return await booksCollection.find(filter).toArray();
}

/**
 * Updates a book in the database.
 * @param {string} id - The ID of the book to update.
 * @param {Object} updates - An object containing the fields to update and their new values.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateBook(id, updates) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const booksCollection = SophiaSocialDB.collection('books');
    const returnValue = await booksCollection.updateOne({ _id: new ObjectId(String(id))}, { $set: updates });
    console.log('db updateBook', returnValue, id, updates);
    return returnValue;
}

/**
 * Deletes a book by id.
 * @param {string} id The id of the book to be deleted.
 * @returns {Promise<string>} The id of the deleted book.
 */
async function deleteBook(id) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial');
    const booksCollection = SophiaSocialDB.collection('books');
    const returnValue = await booksCollection.deleteOne({_id: new ObjectId(String(id))});
    console.log('db deleteBook', returnValue, id);
    return id;
}

//===CRUD MOVIES===//

/**
 * Creates a new movie in the database.
 * @param {Object} movie - The movie object to be inserted into the database.
 * @returns {Promise<Object>} The movie object that was inserted into the database.
 */
async function createMovie(movie) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const moviesCollection = SophiaSocialDB.collection('movies')
    const returnValue = await moviesCollection.insertOne(movie)
    console.log('db createMovie', returnValue, movie._id)
    return movie
}

/**
 * Retrieves the total number of movies in the database.
 * @returns {Promise<number>} The total number of movies in the database.
 */
async function countMovies() {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const moviesCollection = SophiaSocialDB.collection('movies')
    return await moviesCollection.countDocuments()
}

/**
 * Retrieves a list of movies from the database.
 * @param {Object} [filter] - Optional filter object to narrow down the results.
 * @returns {Promise<Object[]>} An array of movie objects, or an empty array if no movies match the filter.
 */
async function getMovies(filter) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const moviesCollection = SophiaSocialDB.collection('movies')
    return await moviesCollection.find(filter).toArray()
}

/**
 * Updates a movie in the database.
 * @param {string} id - The ID of the movie to update.
 * @param {Object} updates - An object containing the fields to update and their new values.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateMovie(id, updates) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const moviesCollection = SophiaSocialDB.collection('movies')
    const returnValue = await moviesCollection.updateOne({ _id: new ObjectId(String(id))}, { $set: updates })
    console.log('db updateMovie', returnValue, id, updates)
    return returnValue
}

/**
 * Deletes a movie by id.
 * @param {string} id The id of the movie to be deleted.
 * @returns {Promise<string>} The id of the deleted movie.
 */
async function deleteMovie(id) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const moviesCollection = SophiaSocialDB.collection('movies')
    const returnValue = await moviesCollection.deleteOne({_id: new ObjectId(String(id))})
    console.log('db deleteMovie', returnValue, id)
    return id
}

//===CRUD PROPOSALS===//

/**
 * Creates a new proposal in the database.
 * @param {Object} proposal - The proposal data to be inserted into the database.
 * @returns {Promise<Object>} The newly created proposal object.
 */
async function createProposal(proposal) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const proposalsCollection = SophiaSocialDB.collection('proposals')
    const clubsCollection = SophiaSocialDB.collection('clubs')
    const usersCollection = SophiaSocialDB.collection('users')

    const proposalToInsert = {
        ...proposal,
        productId: new ObjectId(String(proposal.productId)),
        userId: new ObjectId(String(proposal.userId)),
        clubId: new ObjectId(String(proposal.clubId))
    }

    const result = await proposalsCollection.insertOne(proposalToInsert);

    if (!result.acknowledged) {
        throw new Error('Error al crear la propuesta');
    }

    const proposalId = result.insertedId;

    await clubsCollection.updateOne(
        {_id: new ObjectId(String(proposal.clubId))},
        {$push: {proposals: proposalId}}
    );

    await usersCollection.updateOne(
        {_id: new ObjectId(String(proposal.userId))},
        {$push: {proposals: proposalId}}
    );
    return {...proposalToInsert, _id: proposalId};

}

/**
 * Retrieves the total number of proposals in the database.
 * @returns {Promise<number>} The total number of proposals.
 */
async function countProposals() {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const proposalsCollection = SophiaSocialDB.collection('proposals')
    return await proposalsCollection.countDocuments()
}

/**
 * Retrieves a list of proposals from the database.
 * @param {Object} [filter] - Optional filter object to narrow down the results.
 * @returns {Promise<Object[]>} An array of proposal objects, or an empty array if no proposals match the filter.
 */
async function getProposals(filter) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const proposalsCollection = SophiaSocialDB.collection('proposals')
    return await proposalsCollection.find(filter).toArray()
}

async function getProposalsByIds(ids) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const proposalsCollection = SophiaSocialDB.collection('proposals')
    const booksCollection = SophiaSocialDB.collection('books');
    const moviesCollection = SophiaSocialDB.collection('movies');
    const usersCollection = SophiaSocialDB.collection('users');

    const objectIds = ids.map(id => new ObjectId(String(id)));
    const proposals = await proposalsCollection.find({ _id: { $in: objectIds } }).toArray();

    for (let proposal of proposals) {
        if (proposal.productType === 'book') {
            proposal.productData = await booksCollection.findOne({ _id: new ObjectId(String(proposal.productId)) });
        } else if (proposal.productType === 'movie') {
            proposal.productData = await moviesCollection.findOne({ _id: new ObjectId(String(proposal.productId)) });
        }
        const user = await usersCollection.findOne({ _id: new ObjectId(String(proposal.userId)) });
        proposal.userName = user ? user.name : 'Usuario desconocido';
    }
    
    return proposals
}

/**
 * Updates a proposal in the database.
 * @param {string} id - The ID of the proposal to update.
 * @param {Object} updates - An object containing the fields to update and their new values.
 * @returns {Promise<Object>} The result of the update operation.
 */

async function updateProposal(id, updates) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const proposalsCollection = SophiaSocialDB.collection('proposals')
    const returnValue = await proposalsCollection.updateOne({ _id: new ObjectId(String(id))}, { $set: updates })
    console.log('db updateProposal', returnValue, id, updates)
    return returnValue
}

async function voteProposal(proposalId) {
    const client = new MongoClient(URI);
    const SophiaSocialDB = client.db('SophiaSocial');
    const proposalsCollection = SophiaSocialDB.collection('proposals');

    return await proposalsCollection.updateOne(
        {_id: new ObjectId(String(proposalId))},
        {$inc: {votes: 1}}
    )
}

/**
 * Deletes a proposal by id.
 * @param {string} id The id of the proposal to be deleted.
 * @returns {Promise<string>} The id of the deleted proposal.
 */
async function deleteProposal(id) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const proposalsCollection = SophiaSocialDB.collection('proposals')
    const returnValue = await proposalsCollection.deleteOne({_id: new ObjectId(String(id))})
    console.log('db deleteProposal', returnValue, id)
    return id
}

//===CRUD VOTES===//

/**
 * Creates a new vote in the database.
 * @param {Object} vote - The vote data to be inserted into the database.
 * @returns {Promise<Object>} The newly created vote object.
 */

async function createVote(vote) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const votesCollection = SophiaSocialDB.collection('votes')
    const usersCollection = SophiaSocialDB.collection('users')

    const voteToInsert = {
        proposalId: new ObjectId(String(vote.proposalId)),
        userId: new ObjectId(String(vote.userId)),
    }
    

    const returnValue = await votesCollection.insertOne(voteToInsert);

    await usersCollection.updateOne(
        { _id: new ObjectId(String(vote.userId)) },
        { $push: { votes: returnValue.insertedId } }
    )

    return returnValue
}

/**
 * Retrieves the total number of votes in the database.
 * @returns {Promise<number>} The total number of votes.
 */
async function countVotes() {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const votesCollection = SophiaSocialDB.collection('votes')
    return await votesCollection.countDocuments()
}

/**
 * Retrieves a list of votes from the database.
 * @param {Object} [filter] - Optional filter object to narrow down the results.
 * @returns {Promise<Object[]>} An array of vote objects, or an empty array if no votes match the filter.
 */
async function getVotes(filter) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const votesCollection = SophiaSocialDB.collection('votes')
    return await votesCollection.find(filter).toArray()
}

async function getVotesByUser(userId) {
    const client = new MongoClient(URI);
    const SophiaSocialDB = client.db('SophiaSocial');
    const votesCollection = SophiaSocialDB.collection('votes');

    const userVotes = await votesCollection.find({ userId: new ObjectId(String(userId)) }).toArray();
    return userVotes.map(vote => ({ proposalId: String(vote.proposalId) })); 
}

/**
 * Updates a vote in the database.
 * @param {string} id - The ID of the vote to update.
 * @param {Object} updates - An object containing the fields to update and their new values.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateVote(id, updates) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const votesCollection = SophiaSocialDB.collection('votes')
    const returnValue = await votesCollection.updateOne({ _id: new ObjectId(String(id))}, { $set: updates })
    console.log('db updateVote', returnValue, id, updates)
    return returnValue
}

/**
 * Deletes a vote by id.
 * @param {string} id - The id of the vote to be deleted.
 * @returns {Promise<string>} The id of the deleted vote.
 */
async function deleteVote(id) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const votesCollection = SophiaSocialDB.collection('votes')
    const returnValue = await votesCollection.deleteOne({_id: new ObjectId(String(id))})
    console.log('db deleteVote', returnValue, id)
    return id
}

//===CRUD RATINGS===//

/**
 * Creates a new rating in the database.
 * @param {Object} rating - The rating object to be inserted.
 * @returns {Promise<Object>} The created rating object.
 */
async function createRating(rating) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const ratingsCollection = SophiaSocialDB.collection('ratings')
    const returnValue = await ratingsCollection.insertOne(rating)
    console.log('db createRating', returnValue, rating._id)
    return rating
}

/**
 * Retrieves the total number of ratings in the database.
 * @returns {Promise<number>} The count of ratings in the database.
 */
async function countRatings() {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const ratingsCollection = SophiaSocialDB.collection('ratings')
    return await ratingsCollection.countDocuments()
}

/**
 * Retrieves a list of ratings from the database.
 * @param {Object} [filter] - Optional filter object to narrow down the results.
 * @returns {Promise<Object[]>} An array of rating objects, or an empty array if no ratings match the filter.
 */
async function getRatings(filter) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const ratingsCollection = SophiaSocialDB.collection('ratings')
    return await ratingsCollection.find(filter).toArray()
}

/**
 * Updates a rating in the database.
 * @param {string} id - The ID of the rating to update.
 * @param {Object} updates - An object containing the fields to update and their new values.
 * @returns {Promise<Object>} The result of the update operation.
 */

async function updateRating(id, updates) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const ratingsCollection = SophiaSocialDB.collection('ratings')
    const returnValue = await ratingsCollection.updateOne({ _id: new ObjectId(String(id))}, { $set: updates })
    console.log('db updateRating', returnValue, id, updates)
    return returnValue
}

/**
 * Deletes a rating by id.
 * @param {string} id The id of the rating to be deleted.
 * @returns {Promise<string>} The id of the deleted rating.
 */
async function deleteRating(id) {
    const client = new MongoClient(URI)
    const SophiaSocialDB = client.db('SophiaSocial')
    const ratingsCollection = SophiaSocialDB.collection('ratings')
    const returnValue = await ratingsCollection.deleteOne({_id: new ObjectId(String(id))})
    console.log('db deleteRating', returnValue, id)
    return id
}

function Oauth2() {
    return '123456'
}