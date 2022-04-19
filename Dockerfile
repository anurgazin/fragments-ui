FROM node:16.14-alpine@sha256:2c6c59cf4d34d4f937ddfcf33bab9d8bbad8658d1b9de7b97622566a52167f2b AS dependencies

ENV NODE_ENV=production

LABEL maintainer="Aldiyar Nurgazin <anurgazin@myseneca.ca>"
LABEL description="Fragments-Ui service"

WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install node dependencies defined in package-lock.json
# STEP 20: Installing only production dependencies
RUN npm ci --only=production


USER node

#######################################################################

# Stage 1: use dependencies to build the site
FROM node:16.14-alpine@sha256:2c6c59cf4d34d4f937ddfcf33bab9d8bbad8658d1b9de7b97622566a52167f2b AS builder

WORKDIR /app
# Copy cached dependencies from previous stage so we don't have to download
COPY --from=dependencies /app /app

COPY --chown=node:node ./src ./src
# Copy source code into the image
COPY . .
# Build the site to build/
CMD npm run build

########################################################################

# Stage 2: nginx web server to host the built site
FROM nginx:stable-alpine@sha256:74694f2de64c44787a81f0554aa45b281e468c0c58b8665fafceda624d31e556 AS deploy

# Put our build/ into /usr/share/nginx/html/ and host static files
COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
   CMD curl --fail localhost:80 || exit 1