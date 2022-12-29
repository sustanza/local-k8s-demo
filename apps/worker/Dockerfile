FROM node:lts-bullseye-slim

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    # Found this in other images, not sure whether it's needed, it does not come from Playwright deps
    procps openssl libssl-dev \
		&& rm -rf /var/lib/apt/lists/* \
    && rm -rf /src/*.deb \
    && mkdir /app

### Set working directory
WORKDIR /app/builder

COPY ../../ .

RUN yarn global add turbo && turbo prune --scope=worker --docker

WORKDIR /app
# First install dependencies (as they change less often)
COPY ../../.gitignore .gitignore
RUN cp -r /app/builder/out/json/. .  \
    && cp /app/builder/out/yarn.lock ./yarn.lock

RUN yarn install \
    && yarn cache clean \
    && cp -R /app/builder/out/full/. . \
    && rm -rf /app/builder

COPY ../../turbo.json turbo.json

RUN yarn turbo run build --filter=worker...

RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && chown -R appuser:appuser /app \
    && mkdir -p /home/appuser/.cache/yarn \
    && chown -R appuser:appuser /home/appuser

USER appuser

CMD node ./apps/worker/dist/index.js
