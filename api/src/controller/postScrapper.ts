import { EventEmitter } from 'events';
import { addPosts } from '../controller/post';
import { PostContent } from '../models/Post';

import Transporter from '../services/httpService';

type  ResponseArray = (PostContent|null)[];

export default class PostScrapper {
    allResponses: ResponseArray;
    batchResponses: ResponseArray;
    concurrentUrls: string[];
    baseEvent: EventEmitter;
    transport: Transporter;
    urls: string[];
    maxConcurrent: number;
    baseURL = 'https://jsonplaceholder.typicode.com/posts/';

    constructor(urlsArray: string[] = [], maxConcurrent = 1) {
        this.allResponses = [];
        this.batchResponses = [];
        this.concurrentUrls = [];

        this.baseEvent = new EventEmitter();
        this.initiateEventHandlers();

        this.transport = new Transporter(this.baseURL);
        this.urls = urlsArray;
        this.maxConcurrent = maxConcurrent;
    }

    private initiateEventHandlers() {
        this.baseEvent.on('request', this.runTask);
        this.baseEvent.on('response', this.handleResponse);
        this.baseEvent.once('end', this.endAllTasks);
    }

    startJob() {        
        this.concurrentUrls = this.urls.splice(0, this.maxConcurrent);
        this.concurrentUrls.map(url => this.baseEvent.emit('request', { url }));
    }

    private runTask = ({ url }: {url: string}) => {
        this.transport.getUrl(url).then(({ data }) => {
            return this.baseEvent.emit('response', data);
        }).catch(error => {
            console.log('has error');
            return this.baseEvent.emit('response', null);
        });

    }

    private handleResponse = (data: PostContent | null) => {
        this.batchResponses.push(data);
        if (this.batchResponses.length === this.concurrentUrls.length) {
            this.getNextUrls();
        }
    }

    private endAllTasks = (responses: ResponseArray) => {
        const posts = responses.filter(data => data !== null);
        addPosts(posts);
        this.baseEvent.removeAllListeners();
    }

    private getNextUrls() {
        this.allResponses = [...this.allResponses, ...this.batchResponses];
        this.batchResponses = [];

        if (this.urls.length > 0) {
            this.concurrentUrls = this.urls.splice(0, this.maxConcurrent);
            this.concurrentUrls.map(url => this.baseEvent.emit('request', { url }));
        } else {
            this.baseEvent.emit('end', this.allResponses);
        }
    }
};