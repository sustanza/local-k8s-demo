import {connect} from "amqplib"
import type { NextApiRequest, NextApiResponse } from "next";
import logger from "logger";

/**
 * Users
 *
 * @description A basic API endpoint to retrieve all the users in the database
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Get the queue url
    const QUEUE_URL = process.env.QUEUE_URL

    // blow up if there is no queue url since it is required
    if (!QUEUE_URL) {
        throw new Error("QUEUE_URL is not defined")
    }

    // establish a connection to the queue
    const connection = await connect(QUEUE_URL);

    // open a channel on the queue
    const queueChannel = await connection.createChannel();

    // assert there is a queue, create and make sure it's configured to our specifications
    await queueChannel.assertQueue('worker-ping')

    for (let i = 0; i < 100; i++) {
      queueChannel.sendToQueue('worker-ping', Buffer.from(JSON.stringify({ping: `Hey there 👋 ${i}`})))
  
      // hang around for the message to be sent to the queue
      setTimeout(async () => {
      }, 500)
    }

    logger.info('All good!')
    return res.status(200).end()
  } catch (e) {
    logger.error(e)

    return res.status(500).end('Something blew up!');
  }
}