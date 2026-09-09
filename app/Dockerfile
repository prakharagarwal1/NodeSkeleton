FROM node:20-alpine

WORKDIR /app

# Install only production dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source
COPY app/ ./

# Create a writable log directory for the non-root application user.
RUN addgroup -g 1001 -S nodejs \
    && adduser -u 1001 -S nextjs -G nodejs \
    && mkdir -p /app/logs \
    && chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV LOG_DIR=/app/logs

CMD ["node", "index.js"]