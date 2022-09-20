const express = require('express')
const fs = require('fs');
const notes = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('./helpers/fsUtils');
const path = require('path');
const uuid = require('./helpers/uuid')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.port || 3001;

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
    );

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
    );

app.get('/api/notes', (req, res) => readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data))));

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if(title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
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

app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id)
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        console.log(data)
        if (err) {
            res.status(500).send('Error deleting note')
        } else {
            const parsedData = JSON.parse(data);
            for (let i = 0; i < parsedData.length; i++) {
                if (req.params.id === parsedData[i].id) {
                    parsedData.splice(i, 1)
                }                
            }
            writeToFile('./db/db.json', parsedData)
            res.json('Note deleted');
        }
    })
})


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`))