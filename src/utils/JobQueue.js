export default class JobQueue {
    constructor(limit = 3) {
        this._limit = limit;
        this._queue = [];
        this._concurrent = 0;
    }

    addQueue(job) {
        this._queue.push(
            job
        );
    }

    async doQueue() {
        if (this._concurrent < this._limit && this._queue.length > 0) {
            let job = this._queue.shift();
            this._concurrent++;
            job().finally(()=>{
                this._concurrent--;
                this.doQueue();
            });
            this.doQueue()
        }
    }
}