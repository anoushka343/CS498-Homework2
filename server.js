const exp = require('express');
const {Datastore} = require("@google-cloud/datastore");
const app = exp();
const port = 8080;

//after everything is defined, go through the json requrests
app.use(exp.json());

//get the database created 
const db = new Datastore({databaseId: "cs498-hw2table"});

//add the hello world thing again just to verify
app.get("/", (rec, out) => {out.send("Hello World!");});

//add the register endpoint
//username : aman
//use app.post to add data in a way
app.post('/register', (rec, out) => {const username = rec.body.username;
                if(!username) {
                        return out.send("invalid username");
                }
                const entry = db.key(["User", username]);
                //save the username to the data then
                db.save({key: entry, data:{username}})
                .then(() => out.send("registered success"))
                .catch((err)=>out.send(err.message));});


//now add the list endpoint
app.get("/list", (rec, out) => {const q = db.createQuery("User");
                        db.runQuery(q)
                        .then(([users]) => {const names = users.map(x => x.username);
                        out.json({users: names});})
                        .catch(err=>out.send(err.message));});

app.listen(port, "0.0.0.0", () => {console.log(`this server ${port}`);});
