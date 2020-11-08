import axios, { AxiosInstance } from 'axios';

export default class Transporter {
    maxTries = 2;
    transport: AxiosInstance;

    constructor(baseURL: string) {
        this.transport = axios.create({
            baseURL,
            headers: {
                tries: 0
            },
        });
        this.initiateInterceptor();
    }

    private initiateInterceptor() {
        this.transport.interceptors.response.use(
            null,
            (error) => {
                const config = error.config;
                console.log(config);
                const tries = config.headers.tries + 1;
                if (tries <= this.maxTries) {
                    console.log('retrying tries:', tries);
                    return this.transport.request({
                        url: config.url,
                        headers: {
                            tries
                        },
                    });
                }
                console.log('rejected tries:', tries);
                return Promise.reject(error);
            }
        );
    }

    async getUrl(url: string) {
        const response = await this.transport.request({url});
        return response;
    }
};