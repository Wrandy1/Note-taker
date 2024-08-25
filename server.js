const express = require('express');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log("here");
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) =>{
  const dbFilePath = path.join(__dirname, '/db/', 'db.json');

  fs.readFile(dbFilePath, 'utf-8', (err, data) => {
      if (err){
          console.error('Error reading file:', err);
          return res.status(500).json({ error: 'Failed to read data' });
      }

      let dbData;
      try{
          dbData = JSON.parse(data);
      }catch(error){
          return res.status(500).json({ error: 'Failed to read data' });
      }
      return res.status(200).json(dbData)
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  const dbFilePath = path.join(__dirname, '/db/','db.json');

  fs.readFile(dbFilePath, 'utf-8', (err, data) => {
      if (err){
          console.error('Error reading file:', err);
          return res.status(500).json({ error: 'Failed to read data' });
      }

      let dbData;
      try{
          dbData = JSON.parse(data);
      }catch(error){
          return res.status(500).json({error: 'Failed to read data'});
      }
      newNote.id = "1"

      dbData.push(newNote);
      
      fs.writeFile(dbFilePath, JSON.stringify(dbData, null, 2), 'utf-8', (err) =>{
          if (err){
              return res.status(500).json({error: 'Failed to write data'});
          }

          res.status(201).json({message: 'Data Saved successfully'});
      });
  });
});

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(PORT, ()=> {
  console.log(`Server is running on http://localhost:${PORT}`);
});
