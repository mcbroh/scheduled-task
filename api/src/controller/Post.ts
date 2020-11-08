import Post, { PostContent } from '../models/Post';

export function addPosts(posts: PostContent[]): Promise<any> {
    return Post.bulkWrite(posts.map(doc => {
        const data = { ...doc, postId: doc.id };
        delete data.id;
        return {
            updateOne: {
                filter: { postId: data.postId },
                update: data,
                upsert: true
            }
        }
    }))
        .then(() => {
            console.log("Data inserted");
        }).catch((error) => {
            console.log(error);
        });
}

export function getAllPost(arg?: object): Promise<any> {
    return Post.find()
        .then(data => ({ data, success: true }))
        .catch(error => ({ error, success: false }));
}

export function getAllUpdatedPost(): Promise<any> {
    return Post.find()
        .where({ updated: true })
        .then(data => data)
        .catch(error => ({ error, success: false }));
}

export function updatePost({ _id, title, body }): Promise<any> {
    return Post.findByIdAndUpdate(_id, { body, title, updated: true })
        .then(() => ({ success: true }))
        .catch(error => ({ error, success: false }));
}