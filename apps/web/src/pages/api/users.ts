import { prisma } from "database";
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
    const users = await prisma.user.findMany();
    if (!users)
      throw {
        message: "Failed to retrieve users",
        status: 500,
      };

    logger.info('All good!')
    return res.status(200).json({
      users,
    });
  } catch (e) {
    logger.error(e)

    return res.status(500).end('Something blew up!');
  }
}