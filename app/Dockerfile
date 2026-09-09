FROM node:20-alpine

WORKDIR /app

# Install only production dependencies first (better layer caching)
COPY app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source
COPY app/ ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -u 1001 -S nextjs -G nodejs \
    && chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "index.js"]