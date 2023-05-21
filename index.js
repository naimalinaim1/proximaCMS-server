import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// app info
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ybzmsy1.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const database = client.db("firebaseAuthWithEcceDB");
    const projectInfoCollection = database.collection("createdProjectInfo");
    const projectCollection = database.collection("projects");

    // get projects info
    app.get("/getAllProjectsInfo", async (req, res) => {
      const result = await projectInfoCollection.find().toArray();
      res.send(result);
    });

    // get project info by email
    app.get("/getProjectsInfoByEmail", async (req, res) => {
      const projectUserEmail = req.query?.userEmail;
      const query = { projectUserEmail };
      const options = {
        projection: { projectUserEmail: 0 },
      };
      const result = await projectInfoCollection.find(query, options).toArray();
      res.send(result);
    });

    // create a project info
    app.post("/createAProjectInfo", async (req, res) => {
      const projectInfo = req.body;
      const result = await projectInfoCollection.insertOne(projectInfo);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);

// listen port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
