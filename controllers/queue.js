import { db } from "../connect.js";

export const createQueue = (req, res) => {
    const { name, status } = req.body;

    //Check for missing fields
    if (name === "" || status === "") {
        return res.status(400).json("Missing fields");
    }

    // Check if queue name already exists
    const q = "SELECT * FROM queues WHERE name = ?";

    db.query(q, [name], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length)
            return res.status(409).json("Queue name already exists");

        // Create queue
        const q = "INSERT INTO queues (name, status) VALUES (?, ?)";

        db.query(q, [name, status], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Queue created");
        });
    });
};

export const getQueue = (req, res) => {
    const queueId = req.params.queueId;

    const q = "SELECT * FROM queues WHERE id = ?";

    db.query(q, [queueId], (err, data) => {
        if (err) return res.status(500).json(err);
        console.log(data);
        return res.status(200).json(data);
    });
};
