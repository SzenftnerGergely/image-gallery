import express from "express"
import fs from "fs/promises"
import type { Request, Response } from "express"
import cors from "cors"
import {z} from "zod"

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const ImageSchema = z.object({
    name: z.string(),
    title: z.string(),
    url: z.string(),
    id: z.string(),
})

app.get('/api/images', async (req: Request, res: Response) => {
    const data = await fs.readFile("./data/data.json", "utf-8")
    res.send(JSON.parse(data)) 
})

app.post("/api/images", async (req: Request, res: Response) => {

    const result = ImageSchema.safeParse(req.body)
    if(!result.success) {
        return res.sendStatus(400)
    }

    const imageData = await fs.readFile("./data/data.json", "utf-8")
    const images = JSON.parse(imageData)
    images.push(result.data)
    await fs.writeFile("./data/data.json", JSON.stringify(images), "utf-8")

    res.status(200).json(images)
})

app.delete("/api/images/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    
    const imageData = await fs.readFile("./data/data.json", "utf-8")
    let images = JSON.parse(imageData)
    images = images.filter((image: { id: string }) => image.id !== id)
    
    await fs.writeFile("./data/data.json", JSON.stringify(images), "utf-8")

    res.status(200).json(images)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})