import Bull, { Queue, QueueOptions, Job, DoneCallback } from 'bull'
import { AddQueueJobDTO, CreateQueueDTO, CreateWorkerDTO, JobDataDTO } from '../dtos/queue.dto';

class BullQueue {

    private queues: Map<string, Queue> = new Map();
    private HOST: string;
    private PORT: string;
    private USER: string;
    private PASSWORD: string;

    constructor() {

        if (!process.env.REDIS_HOST) {
            throw new Error('Redis host is not defined')
        } else if (!process.env.REDIS_PORT) {
            throw new Error('Redis port is not defined')
        } else if (!process.env.REDIS_USER) {
            throw new Error('Redis username is not defined')
        } else if (!process.env.REDIS_PASSWORD) {
            throw new Error('Redis password is not defined')
        }

        this.HOST = process.env.REDIS_HOST;
        this.PORT = process.env.REDIS_PORT;
        this.USER = process.env.REDIS_USER;
        this.PASSWORD = process.env.REDIS_PASSWORD;

    }

    /**
     * @name createQueue
     * @param data 
     * @returns 
     */
    public async createQueue(data: CreateQueueDTO): Promise<Queue> {

        const { name } = data;

        if (this.queues.has(name)) {
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
                connectTimeout: 80000,
                host: this.HOST,
                password: this.PASSWORD,
                username: this.USER,
                port: parseInt(this.PORT)
            },
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                }
            }
        }

        const newQueue = new Bull(name, options);
        this.queues.set(name, newQueue);

        return newQueue

    }

    /**
     * @name addProcessor
     * @param data 
     * @param callback 
     */
    public async addProcessor(data: CreateWorkerDTO, callback: (data: Job<JobDataDTO>, done: DoneCallback) => Promise<void>): Promise<Queue> {

        const { jobName, queueName, concurrency = 10 } = data;

        const queue = await this.createQueue({ name: queueName });

        // process with the worker ( which contains the job function )
        // Process jobs with concurrency (e.g., 1 for sequential processing, or more for parallel)
        // Default concurrency is 1
        queue.process(jobName, concurrency, callback);

        // completed
        queue.on('completed', (job) => {
            console.log(`job with the id: ${job.id} completed`)
        })

        // failed
        queue.on('failed', (job, err) => {
            console.log(`Job with id: ${job.id} failed for queue: ${queue.name} with error: ${err.message}`)
        })

        // error
        queue.on('error', (err) => {
            console.log(`Queue '${queue.name}' experienced an error: ${err.message}`)
        });

        return queue;

    }

    /**
     * @name addJobs
     * @param data 
     */
    public async addJobs(data: AddQueueJobDTO): Promise<void> {

        const { queueName, jobs } = data;

        const queue = await this.createQueue({ name: queueName });

        const bulkJobs = jobs.map(job => ({
            name: job.name,
            data: job.data,
            opts: job.options
        }));

        // add all jobs
        await queue.addBulk(bulkJobs);

        // log add jobs
        const jobIds = bulkJobs.map(job => job.opts?.jobId || 'N/A').join(', ');
        console.log(`Added ${jobs.length} jobs to queue '${queue.name}'. Job IDs: ${jobIds}`)

    }

    /**
     * @name getQueue
     * @param name The name of the queue to retrieve.
     * @returns The Queue instance, or undefined if not found.
     */
    public getQueue(name: string): Queue | undefined {
        return this.queues.get(name);
    }

}

export default new BullQueue()