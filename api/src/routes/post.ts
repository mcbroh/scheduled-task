import { Router, Request, Response, NextFunction } from "express";
import { getAllPost, updatePost } from "../controller/post";

const router = Router();

router.get('/posts', async (req: Request, res: Response, next: NextFunction) => {

    const allPosts = await getAllPost();

    res.send(allPosts);
});

router.patch('/post', async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    
    if (!payload._id || !payload.body || !payload.title) {
        return res.send({ success: false, message: 'Id, body or title missing' });
    }
    const response = await updatePost(payload);

    res.send(response);
});

export const postRouter = router;


