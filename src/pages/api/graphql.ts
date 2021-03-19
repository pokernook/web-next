import Fastify, { HTTPMethods } from "fastify";
import helmet from "fastify-helmet";
import mercurius from "mercurius";
import { NextApiHandler } from "next";

import { schema } from "../../schema";

const build = async () => {
  const app = Fastify();

  await app.register(helmet);
  await app.register(mercurius, {
    path: "/api/graphql",
    schema,
  });

  return app;
};

const apiHandler: NextApiHandler = async (req, res) => {
  const app = await build();
  const { body, headers, statusCode } = await app.inject({
    cookies: req.cookies,
    headers: req.headers,
    method: req.method as HTTPMethods,
    payload: req.body,
    query: req.query,
    url: req.url,
  });

  for (const key in headers) {
    const header = headers[key]!;
    res.setHeader(key, header);
  }

  res.status(statusCode).end(body);
};

export default apiHandler;
