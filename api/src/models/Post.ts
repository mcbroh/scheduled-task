import { Schema, model } from 'mongoose';

export interface PostContent {
    id?: number;
    userId: number;
    postId: number;
    title: string;
    body: string;
}

const PostSchema = new Schema({
    userId: Number,
    postId:  Number,
    title: String,
    body: String,
    updated: {
        type: Boolean, 
        default: false,   
    },
});

export default model("Post", PostSchema);