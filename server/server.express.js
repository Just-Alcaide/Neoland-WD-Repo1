import express from 'express';
import bodyParser from 'body-parser';
import { crud } from "./server.crud.js";

const USERS_URL = './server/BBDD/users.json'
const CLUBS_URL = './server/BBDD/clubs.json'
const PROPOSALS_URL = './server/BBDD/proposals.json'
const BOOKS_URL = './server/BBDD/books.json'
const MOVIES_URL = './server/BBDD/movies.json'

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./Proyecto-final/src'));
  
app.post('/create/users', (req, res) => {
  crud.create(USERS_URL, req.body, (data) => {
    res.json(data)
  });
})

app.get('/read/users', (req, res) => {
  crud.read(USERS_URL, (data) => {
    res.json(data)
  });
})

app.put('/update/users/:id', (req, res) => {
  crud.update(USERS_URL, req.params.id, req.body, (user) => {
    const userWithoutPassword = {...user, password: undefined};
    res.json(userWithoutPassword);
  });
})

app.get('/filter/users', (req, res) => {
  crud.filter(USERS_URL, req.body, (data) => {
    res.json(data)
    
  });
})

app.post('/login/users', (req, res) => {
  const { email, password } = req.body;

  crud.read(USERS_URL, (users) => {
    if (!users || users.length === 0) {
      return res.status(400).json({ success: false, message: 'No users found' });
    } 
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const userWithoutPassword = {...user, password: undefined};
    res.json(userWithoutPassword);
  })
})

app.delete('/delete/users/:id', (req, res) => {
  const userId = req.params.id;
  const { email, password } = req.body;

  crud.read(USERS_URL, (users) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1){
      return res.status(404).json({ success:false, message: 'User not found' });
    } 

    const user = users[userIndex];
    if (user.email !== email || user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    crud.delete(USERS_URL, userId, (updatedUsers) => {
      res.json({ success: true, message: 'User deleted successfully', data: updatedUsers });
    });
  })
})

app.post('/create/clubs', (req, res) => {
  crud.create(CLUBS_URL, req.body, (data) => {
    res.json(data)
  });
})

app.get('/read/clubs', (req, res) => {
  crud.read(CLUBS_URL, (data) => {
    res.json(data)
  });
})

app.put('/update/clubs/:id', (req, res) => {
  crud.update(CLUBS_URL, req.params.id, req.body, (data) => {
    res.json(data)
  });
})

app.post('/filter/clubs', (req, res) => {
  const filterParams = req.body;
  crud.filter(CLUBS_URL, filterParams, (data) => {
    res.json(data)
  });
})

app.delete('/delete/clubs/:id', (req, res) => {
  crud.delete(CLUBS_URL, req.params.id, (data) => {
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }
    res.json(data)
  });
})

app.post('/create/proposals', (req, res) => {
  crud.create(PROPOSALS_URL, req.body, (data) => {
    res.json(data)
  });
})

app.get('/read/proposals', (req, res) => {
  crud.read(PROPOSALS_URL, (data) => {
    res.json(data)
  });
})

app.put('/update/proposals/:id', (req, res) => {
  crud.update(PROPOSALS_URL, req.params.id, req.body, (data) => {
    res.json(data)
  });
})

app.get('/filter/proposals', (req, res) => {
  crud.filter(PROPOSALS_URL, req.body, (data) => {
    res.json(data)
  });
})

app.delete('/delete/proposals/:id', (req, res) => {
  crud.delete(PROPOSALS_URL, req.params.id, (data) => {
    res.json(data)
  });
})

app.post('/create/books', (req, res) => {
  crud.create(BOOKS_URL, req.body, (data) => {
    res.json(data)
  });
})

app.get('/read/books', (req, res) => {
  crud.read(BOOKS_URL, (data) => {
    res.json(data)
  });
})

app.put('/update/books/:id', (req, res) => {
  crud.update(BOOKS_URL, req.params.id, req.body, (data) => {
    res.json(data)
  });
})

app.get('/filter/books', (req, res) => {
  crud.filter(BOOKS_URL, req.body, (data) => {
    res.json(data)
  });
})

app.delete('/delete/books/:id', (req, res) => {
  crud.delete(BOOKS_URL, req.params.id, (data) => {
    res.json(data)
  });
})

app.post('/create/movies', (req, res) => {
  crud.create(MOVIES_URL, req.body, (data) => {
    res.json(data)
  });
})

app.get('/read/movies', (req, res) => {
  crud.read(MOVIES_URL, (data) => {
    res.json(data)
  });
})

app.put('/update/movies/:id', (req, res) => {
  crud.update(MOVIES_URL, req.params.id, req.body, (data) => {
    res.json(data)
  });
})

app.get('/filter/movies', (req, res) => {
  crud.filter(MOVIES_URL, req.body, (data) => {
    res.json(data)
  });
})

app.delete('/delete/movies/:id', (req, res) => {
  crud.delete(MOVIES_URL, req.params.id, (data) => {
    res.json(data)
  });
})


app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})