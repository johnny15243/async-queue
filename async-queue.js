class QueueItem{
    #interval;
    #callbackFn;
    #executionTime;
    
    constructor(args = {}){
        if('callbackFn' in args)
            this.#callbackFn = args?.callbackFn;
        if('inteval' in args){
            this.#interval = args?.interval;
            this.updateRunTime();
        }
    }

    setInterval(interval){
        this.#interval = interval;
        this.updateRunTime();
        return this;
    }

    setCallbackFn(callbackFn){
        this.#callbackFn = callbackFn;
        return this;
    }

    get elapsed(){
        return new Date().getTime() >= this.#executionTime;
    }

    get callbackFn(){
        return this.#callbackFn;
    }

    updateRunTime(){
        this.#executionTime = new Date().getTime() + this.#interval;
    }
}

class Queue {
    queueItemList = [];
    intervalObj = undefined;
    
    constructor(){
    }

    enqueue(item){
        this.queueItemList.push(item);
    }

    dequeue(){
        if(this.isEmpty())
            return "Underflow";
        return this.queueItemList.shift();
    }

    get list(){
        return this.queueItemList;
    }

    merge(queueObj){
        this.queueItemList = [...this.queueItemList, queueObj.list]
    }

    get length(){
        return this.queueItemList.length;
    }

    isEmpty()
    {
        return this.queueItemList.length == 0;
    }
}

class QueueHandler{
    static #currentQueue = new Queue();
    static #newQueue = new Queue();
    static #interval;
    static #queueRunning = false;
    static #debug = false;

    static async #run(){
        if(QueueHandler.#newQueue.isEmpty())
            return true;

        QueueHandler.#initRun();
        let result = [];
        while(!QueueHandler.#currentQueue.isEmpty()){
            result.push(new Promise(
                function(resolve, reject){
                    if(this.currentQueueItem.elapsed){
                        try{
                            var retval = (this.currentQueueItem.callbackFn)();
                            if(!retval){
                                this.currentQueueItem.updateRunTime();
                                QueueHandler.add(this.currentQueueItem);
                            }
                            return resolve(retval);
                        }catch(errmsg){
                            return reject(errmsg)
                        }
                    }else{
                        QueueHandler.add(this.currentQueueItem); 
                    }
                    return resolve(false);
                }.bind({"currentQueueItem":QueueHandler.#currentQueue.dequeue()}))
            );
        }

        Promise.all(result)
            .then((value)=>{
                if(QueueHandler.#debug)
                    console.warn(value);
            })
            .catch((errorMsg)=>{
                if(QueueHandler.#debug)
                    console.error(errorMsg);
            });
    }

    set debug(bool){
        QueueHandler.#debug = bool;
    }

    static #initRun(){
        if(!!QueueHandler.#currentQueue.isEmpty())
            QueueHandler.#currentQueue = QueueHandler.#newQueue;
        else
            QueueHandler.#currentQueue.merge(QueueHandler.#newQueue);
        QueueHandler.#newQueue = new Queue();
    }

    static add(item){
        QueueHandler.#newQueue.enqueue(item);
    }

    static start(milliseconds){
        if(!QueueHandler.interval)
            QueueHandler.interval = setInterval(async() =>{
                QueueHandler.#run();
            } , milliseconds)
    }

    static stop(){
        clearInterval(QueueHandler.interval);
        QueueHandler.interval = false;
    }
}