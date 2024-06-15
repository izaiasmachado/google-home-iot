const {
  EventHubConsumerClient,
  earliestEventPosition,
} = require("@azure/event-hubs");

async function main() {
  const client = new EventHubConsumerClient(
    "$Default",
    "Endpoint=sb://ihsuprodcqres013dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=VNCQ11VnZGZJXupikZ0hqZqTV13BCr9SPAIoTM2DD8E=;EntityPath=iothub-ehub-azr-iot-hu-56251204-94619fdfff"
  );
  const partitionIds = await client.getPartitionIds();
  console.log(partitionIds[0]);

  // In this sample, we use the position of earliest available event to start from
  // Other common options to configure would be `maxBatchSize` and `maxWaitTimeInSeconds`
  const subscriptionOptions = {
    startPosition: earliestEventPosition,
  };

  const subscription = client.subscribe(
    partitionIds[0],
    {
      processEvents: async (events, context) => {
        console.log(`Received events: ${events.length}`);
        console.log(events);
        // event processing code goes here
      },
      processError: async (err, context) => {
        // error reporting/handling code here
      },
    },
    subscriptionOptions
  );
}

main();
