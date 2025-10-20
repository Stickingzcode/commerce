import { CreateQueueDTO, CreateWorkerDTO, AddQueueJobDTO, JobDataDTO } from "../dtos/queue.dto";
import Bull, { Queue } from "bull";
import { QueueOptions } from "bull";
import { Job, DoneCallback } from "bull";

class BullQueue {
    private queues: Map<string, Queue> = new Map();
    private HOST: string;
    private PORT: string;
    private PASSWORD: string;
    private USER: string;

    constructor() {
        if(!process.env.REDIS_HOST) {
            throw new Error('REDIS_HOST must be defined');
        } else if(!process.env.REDIS_PORT) {
            throw new Error('REDIS_PORT must be defined');
        } else if(!process.env.REDIS_USER) {
            throw new Error('REDIS_USER must be defined');
        } else if(!process.env.REDIS_PASSWORD) {
            throw new Error('REDIS_PASSWORD must be defined');
        }

        this.HOST = process.env.REDIS_HOST;
        this.PORT = process.env.REDIS_PORT;
        this.PASSWORD = process.env.REDIS_PASSWORD;
        this.USER = process.env.REDIS_USER;
    }

    public async createQueue(data: CreateQueueDTO): Promise<Queue> {
        const { name } = data;
        if(this.queues.has(name)) {
            return this.queues.get(name)!;
        }

        const options: QueueOptions = {
            redis: {
                tls: {
                    rejectUnauthorized: false,
                    minVersion: 'TLSv1.2'
                },
                maxRetriesPerRequest: null,
                enableReadyCheck: false,
                connectTimeout: 8000,
                host: this.HOST,
                port: parseInt(this.PORT),
                password: this.PASSWORD,
                username: this.USER,
            },
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                }
            }
        };

        const newQueue = new Bull(name, options);
        this.queues.set(name, newQueue);

        return newQueue;
    }

    public async addProcessor(data: CreateWorkerDTO, callback: (data: Job<JobDataDTO>, done: DoneCallback) => Promise<void>): Promise<Queue> {
        
        const { queueName, jobName, concurrency = 10 } = data;
        const queue = await this.createQueue({ name: queueName });
        
        queue.process(jobName, concurrency, callback);

        queue.on('completed', (job) => {
            console.log(`Job with ID: ${job.id} has been completed`);
        });
        
        queue.on('failed', (job,err) => {
            console.log(`Job with ID: ${job.id} has failed for queue: ${queue.name} with error: ${err.message}`);
        });

        queue.on('error', (error) => {
            console.log(`An error has occured in queue: ${queue.name} with error: ${error.message}`);
        });

        return queue;

    }

    public async addJob(data: AddQueueJobDTO): Promise<void> {
        const { queueName, jobs } = data;
        const queue = await this.createQueue({ name: queueName });

        const bullJobs = jobs.map(job => ({
            name: job.name,
            data: job.data,
            opts: job.options,
        }));

        await queue.addBulk(bullJobs);
        console.log(`Added ${jobs.length} job(s) to queue: ${queue.name}`);

        const jobIds = bullJobs.map(job => job.opts?.jobId || 'N/A').join(', ');
        console.log(`Added ${jobs.length} job(s) with IDs: [${jobIds}] to queue: ${queue.name}`);
    }
}

export default new BullQueue();