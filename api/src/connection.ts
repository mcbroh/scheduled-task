import { connect } from 'mongoose';

const connection = "mongodb://mongo:27017/mongo-test";

const connectDb = () => {
    return connect(connection);
};

export default connectDb;
