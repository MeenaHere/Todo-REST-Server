import request from 'supertest';
import server from './server.js'

describe('Test suit for todos', () => {

    beforeEach(() =>{
        server.toDos = [
        {id: 1, title: "Start Assignment"},
        {id: 2, title: "Pick up Ishu"},
        {id: 3, title: "Practice JS"},
        {id: 4, title: "Buy Groceries"},
        {id: 5, title: "Finish Assignment"}]
    })

    //Get all the todos items and check the response body 
    test('Get all todos', async () => {
        const resp = await request(server).get('/todos')
        expect(resp.status).toEqual(200)
        expect(resp.body.length).toEqual(5)
        expect(resp.body).toEqual([{id: 1, title: "Start Assignment"},
        {id: 2, title: "Pick up Ishu"},
        {id: 3, title: "Practice JS"},
        {id: 4, title: "Buy Groceries"},
        {id: 5, title: "Finish Assignment"}]);
    });
     //Test for get one todos
    test('Get one todo', async () => {
        const resp = await request(server).get('/todos/2')
        expect(resp.status).toEqual(200)
        expect(resp.body).toEqual({id: 2, title: "Pick up Ishu"}
        )
    });

    //Test for get one todos that does not exist
    test('Get one todo with id that does not exist in db', async () => {
        const resp = await request(server).get('/todos/55')
        expect(resp.status).toEqual(404)
        expect(resp.text).toEqual('Id Not Found' )
    });

     //Test for create one todos and check the status code
    test('Create a todo', async () => {
        const resp1 = await request(server).post('/todos').send({"title": "Buy vegetables"}).set('Accept', 'application/json')
        expect(resp1.status).toEqual(201)
        expect(resp1.body).toEqual({"resource": "/todos/6"});

        //get back the added item
        const resp2 = await request(server).get('/todos/6')
        expect(resp2.body).toEqual({id: 6, "title": "Buy vegetables"})


    });

    // Test for create data with wrong item title
    test('Create a todo with the unmatched property', async () => {
        const resp = await request(server).post('/todos').send({todo: false }).set('Accept', 'application/json')
        expect(resp.status).toEqual(400)
        expect(resp.text).toEqual("It seems you didn't add title as the property")
    });

    //test for update todo with matched title(property) 
    test('Update a todo with the matched title', async () => {
        const resp = await request(server).put('/todos/2').send({"title": "Get medicines" })
        expect(resp.status).toEqual(200)
        expect(resp.text).toEqual("id:2 updated")
    });

    //test for update todo with wrong title(property) 
    test('Update a todo with the unmatched property name', async () => {
        const resp = await request(server).put('/todos/2').send({"name": "Change schedule in app" })
        expect(resp.status).toEqual(404)
        expect(resp.text).toEqual("It seems you didn't add title")
    });

    //test for update todo with the id that not present in database 
    test('Update a todo with the id not present in db', async () => {
        const resp = await request(server).put('/todos/7895').send({title: "Change schedule in app" })
        expect(resp.status).toEqual(404)
        expect(resp.text).toEqual("Id Not Found")
    });

    //test for delete one todo with the id that exist in db
    test('Delete the todo with id available in db', async () => {
        const resp = await request(server).delete('/todos/2');
        expect(resp.status).toEqual(200)
        expect(resp.text).toEqual("Todo no. 2 had been deleted")
    });

    //test for delete a todo with id 0
    test('Delete the todo with id 0', async () => {
        const resp = await request(server).delete('/todos/0');
        expect(resp.status).toEqual(404)
        expect(resp.text).toEqual("Id Not Found")
    });

    //test for delete a todo that doesnot exist in db
    test('Delete the todo with id that is not available in db', async () => {
        const resp = await request(server).delete('/todos/789');
        expect(resp.status).toEqual(404)
        expect(resp.text).toEqual("Id Not Found")
    });
});
