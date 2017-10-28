{
  flushInterval: 1000,
  backends: ["../../lib/elastic-backend"],

  // elasticsearchUrl: 'http://localhost:9200', // when on host
  elasticsearchUrl: 'http://elasticsearch:9200', // when in docker
  elasticsearchIndex: 'statsd',
  elasticsearchType: 'metric'

}
