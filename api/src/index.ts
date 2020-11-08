import * as express from 'express';
import * as cors from 'cors';

import connectDb from './connection';
import { postRouter } from './routes/post';
import { postScrapper } from './jobs/postScrapper';

const PORT = 8080;
const app = express();
app.use(cors());
app.use(express.json());
app.use(postRouter);

app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`);

    connectDb().then(() => {
        console.log('MongoDb connected');
        postScrapper();
    });
});
