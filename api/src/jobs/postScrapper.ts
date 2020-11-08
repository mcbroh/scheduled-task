import * as cron from 'node-cron';
import { getAllUpdatedPost } from '../controller/post';

import PostScrapper from '../controller/postScrapper';

export function postScrapper(count = 50, intervals = 5,) {
    cron.schedule('*/60 * * * *', async () => {
        console.log('Job started');
        
        const postsToOmit: number[] = (await getAllUpdatedPost())?.map(data => data.postId);
        const urls = getUrls(count).filter(item => !postsToOmit.includes(Number(item)));

        const postScrapper = new PostScrapper(urls, intervals);
        postScrapper.startJob();
    });
}

function getUrls(count = 50): string[] {
    const urls = [];
    for (let index = 0; index < count; index++) {
        urls.push(`${index + 1}`);
    }

    return urls;
}