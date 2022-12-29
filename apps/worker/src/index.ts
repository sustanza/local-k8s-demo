import {connect, Channel} from "amqplib";
import logger from "logger";

const workerPing = async(channel: Channel) => {
    channel.consume('worker-ping', async (msg) => {
        try {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString())
                const ping = data.ping
                logger.info(`Received: ${ping}`)

                await workerPingExec(ping)
            }
        } catch (e) {
            logger.error(e)
        } finally {
            if (msg) {
                channel.ack(msg);
            }
        }
    })
}

const workerPingExec = async (ping: string) => {
    logger.info(`Recieved ping: ${ping}`)
}

// create a basic self executing anonymous func
(async () => {
    // Set env for worker queue
    const QUEUE_URL = process.env.QUEUE_URL
    const WORKER_NAME = process.env.WORKER_NAME

    // if there is no queue URL blow up since we need that
    if (!QUEUE_URL) {
        throw new Error("QUEUE_URL is not defined")
    }

    // create a connection
    const connection = await connect(QUEUE_URL);

    // create a channel on that connection
    const queueChannel = await connection.createChannel();

    logger.info(`Attempting to initiate worker: ${WORKER_NAME}`)

    switch (WORKER_NAME) {
        case 'worker-ping':
            logger.info(`Starting worker: ${WORKER_NAME}`)
            await queueChannel.assertQueue('worker-ping')

            workerPing(queueChannel)

            break;
        default:
            logger.info(`No queue found for ${WORKER_NAME}`)
    }

})();