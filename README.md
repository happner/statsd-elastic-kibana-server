# statsd-elastic-kibana-server

Docker Statsd / ElasticSearch / Kibana Server

### start elasticsearch and kibana and statsd

see docker-compose.yml

```
docker-compose build
docker-compose up
```

### start example monitored process

```
npm install
bin/example-monitored-process
```

### open kibana in browser

```
open http://localhost:5601
```
set `statsd` as Index pattern with `timestamp` as Time Filter field name

https://www.elastic.co/guide/en/kibana/current/timelion-create.html

`.es(index=statsd, timefield='timestamp', metric='avg:example.gauge1')`
`.es(index=statsd, timefield='timestamp', metric='avg:example.gauge2')`
`.es(index=statsd, timefield='timestamp', metric='avg:example.counter1')`
`.es(index=statsd, timefield='timestamp', metric='avg:example.counter2')`

```

.es(index=statsd,timefield='timestamp',metric='avg:example.gauge1').lines(width=1.5).color(#1E90FF).label('Gauge1'), .es(index=statsd, timefield='timestamp', metric='avg:example.gauge2').lines(fill=1,width=0.5).color(gray).label('Gauge2').title('Gauges')

```

### Turn contianers off

```
docker-compose down
```
