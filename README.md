# statsd-elastic-kibana-server

Docker Statsd / ElasticSearch / Kibana Server

### start elasticsearch and kibana

see docker-compose.yml

```
docker-compose up
```

### start example monitored process

```
bin/example-monitored-process
```

### open kibana in browser

```
open http://localhost:5601
```

set `statsd` as Index pattern with `timestamp` as Time Filter field name
