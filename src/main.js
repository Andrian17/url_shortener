
import express, { json } from "express";
import {prisma} from "../prisma/prisma_client.js"
import shortid from "shortid";


const app = express();
app.use(json())


app.get("/", async (req, res) => {
    const result = await prisma.url.findMany();
    res.send(result).status(200);
});

app.get("/:url", async (req, res) => {
    try {
        const result = await prisma.url.findFirstOrThrow({
            where: {
                short_url: req.params.url
            }
        });
        res.status(301).redirect(result.actual_url);
    } catch (error) {
        res.status(500).send(error)
    }
});

app.post("/submit", async (req, res) => {
    const result = await prisma.url.create({
        data: {
            short_url: shortid.generate(),
            actual_url: req.body.actual_url
        }
    });
    res.status(201).send(result);
})

app.listen(3000, () => {
    console.log(`run on http://localhost:3000`);
});
