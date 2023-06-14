FROM node:16-alpine3.17 AS builder

# Set the working directory to /app inside the container
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

# Copy app files

COPY public/ public
COPY src/ src

# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci


 ENV NODE_ENV production
 ARG $REACT_APP_DEV_BASE_URL
 ENV REACT_APP_DEV_BASE_URL http://localhost:7500/api


# Expose react to port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]


#  ENV NODE_ENV production
#  ARG $REACT_APP_DEV_BASE_URL
#  ENV REACT_APP_DEV_BASE_URL http://localhost:7500/api
#  EXPOSE 4200


# Build the app
#  RUN npm run build

# Bundle static assets with nginx
#  FROM nginx:1.23.4-alpine as production


# Copy built assets from `builder` image
#  COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
#  COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
#  EXPOSE 80

# Start nginx
#  CMD ["nginx", "-g", "daemon off;"]

#  HEALTHCHECK --interval=5s CMD ping -c 1 172.17.0.2