import express from 'express';
import es6Renderer from 'express-es6-template-engine';

const app = express();

app.engine('html', es6Renderer);
app.set('views', 'frontend');
app.set('view engine', 'html');

app.use(express.static('public'))

app.toDos = [{id: 1, title: "Start Assignment"},
            {id: 2, title: "Pick up Ishu"},
            {id: 3, title: "Practice JS"},
            {id: 4, title: "Buy Groceries"},
            {id: 5, title: "Finish Assignment"}];

app.use(express.json())

// api for get all todos
app.get('/todos', (req, res) => {
    res.send(app.toDos);
});

// api for get one todo with id number
app.get('/todos/:id', (req, resp) => {
    const id = Number(req.params.id);
    const searchId = app.toDos.filter(todo => id === todo.id)
    if(searchId.length === 0){
        resp.status(404).send('Id Not Found')
    } else
    resp.status(200).send(searchId[0]);
})

// api for create todo
app.post('/todos', (req, resp) => {
    const title = req.body.title;
    const updatedId = app.toDos[app.toDos.length - 1].id + 1;

    if(title){
      app.toDos.push({
         id: updatedId,
         title
      });
      resp.status(201).send({resource: "/todos/" + updatedId})
    }else{
        resp.status(400).send("It seems you didn't add title as the property")
    }
})

// api for update a todo with id number
app.put('/todos/:id', (req, resp) => {
    const title = req.body.title;
    const id  = Number(req.params.id);
    
    var index = app.toDos.findIndex((todo) => todo.id === id)
    if(title){
        if(index !== -1){
            app.toDos[index].title = title
            resp.status(200).send(`id:${id} updated`)
        }
        else{
            resp.status(404).send('Id Not Found')
        }
    }
    else{
        resp.status(404).send("It seems you didn't add title")
    }
})

// api for delete a todo with id number
app.delete('/todos/:id', (req, resp) => {
    const id  = Number(req.params.id);

    const idToDelete = (app.toDos).map(todo => todo.id).indexOf(id)

    if(idToDelete !== -1){
        app.toDos.splice(idToDelete, 1);
        resp.status(200).send(`Todo no. ${id} had been deleted`)
    } else{
        resp.status(404).send('Id Not Found')
    }
})

app.get('/index.html', function(req, resp) {
    resp.render('index.html', {locals: {toDos: app.toDos, heading: 'My ToDo App!'}});
  });

  export default app;