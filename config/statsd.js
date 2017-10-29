{
  flushInterval: process.env.FLUSH_INTERVAL ? parseInt(process.env.FLUSH_INTERVAL) : 10000,
  backends: ["../../lib/elastic-backend"],
  elasticsearchUrl: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  elasticsearchIndex: process.env.ELASTICSEARCH_INDEX || 'statsd',
  elasticsearchType: process.env.ELASTICSEARCH_TYPE || 'metric'
}
