# Async-Queue  JS

This is a simple **quick&dirty**  **JS-Script**. 

You can add Jobs and the Handler will run them Asyncronous. Code-Sample see below



#### Sample-JS Code
```javascript
    //This will start an Interval (milliseconds)
    //So every 1 second the system will check for a new Queue Item in the list and run through the Queue
    QueueHandler.start(100);

    //Here we create a new QueueItem. This will storean Callbackfunction
    // The returnvalue will declare if the Function will be called again
    queueItem = new QueueItem()
                        .setInterval(500)
                        .setCallbackFn(()=>{
                            $.get( "API/db/status", function( data ) {
                                $( ".result" ).html( data );
                            });
                        });

    //Here we add the Item to the QueueHandler.
    QueueHandler.add(queueItem);
```
