const express = require('express')
const notes = require('express').Router();
const { readAndAppend } = require('./helpers/fsUtils');
const path = require('path');
const uuid = require('./helpers/uuid')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.port || 3001;

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
    );

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
    );

notes.get('/', (req, res) => readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data))));

notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if(title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid()
        };
        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in posting new note')
    }
})


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`))