var request = require('request');
var net = require('net');

exports.init = function (startupTime, config, events, logger) {

  config.elasticsearchUrl = config.elasticsearchUrl || 'http://localhost:9200';
  config.elasticsearchIndex = config.elasticsearchIndex || 'statsd';
  config.elasticsearchType = config.elasticsearchType || 'metric';

  configureElastic(config, logger)

    .then(function () {

      events.on('flush', function (timeStamp, metrics) {

        var timestamp = new Date(0);
        timestamp.setUTCSeconds(timeStamp);

        Object.keys(metrics.counter_rates).forEach(function (name) {
          var value = metrics.counter_rates[name];
          var type = 'counter';
          storeMetric(config, timestamp, name, value, type);
        });

        Object.keys(metrics.gauges).forEach(function (name) {
          var value = metrics.gauges[name];
          var type = 'gauge';
          storeMetric(config, timestamp, name, value, type)
        });

      });

    })

    .catch(function (error) {

      console.error(error.toString());
      process.exit(1); // because can't fail cleanly per silly statsd below

    });

  return true; // silly statsd (non-async plugin.init ok-ness response)

}

function storeMetric(config, timestamp, name, value, type) {
  var indexUrl = config.elasticsearchUrl + '/' +
    config.elasticsearchIndex + '/' +
    config.elasticsearchType

  // console.log(indexUrl, timestamp, name, value, type);
  // return;

  request({
    url: indexUrl,
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      timestamp: timestamp,
      name: name,
      value: value,
      type: type
    })
  }, function (err, res, body) {
    if (err) {
      logger.log(err.toString());
      return;
    }
    if (res.statusCode !== 201) {
      logger.log('insert metric failed:' + res.statusCode +
        ' ' + res.statusMessage);
      return;
    }
  });
}

function configureElastic(config, logger) {
  return Promise.resolve()
    .then(function () {
      return waitForElastic(config, logger);
    })
    .then(function () {
      return createIndex(config)
    })

    .then(function () {
      return createType(config)
    });
}

function waitForElastic(config, logger) {
  var urlParts = config.elasticsearchUrl.split('//');
  var hostPort = urlParts[1].split(':');
  var host = hostPort[0];
  var port = hostPort[1] ? parseInt(hostPort[1]) :
    urlParts[0] == 'http:' ? 80 : 443;

  return new Promise(function (resolve, reject) {
    function tryConnect() {
      var socket = net.connect(port, host);
      logger.log('attempting connect to ' + host + ':' + port);
      socket.on('connect', function () {
        socket.destroy();
        setTimeout(resolve, 2000);
      });
      socket.on('error', function () {
        socket.destroy();
        setTimeout(tryConnect, 1000);
      });
    }
    tryConnect();
  });
}

function createIndex(config) {
  return new Promise(function (resolve, reject) {
    var indexUrl = config.elasticsearchUrl + '/' +
      config.elasticsearchIndex;

    request({
      url: indexUrl,
      method: 'HEAD'
    }, function (err, res, body) {
      if (err) return reject(err);
      if (res.statusCode === 200) return resolve();

      request({
        url: indexUrl,
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          settings: {}
        })
      }, function (err, res, body) {
        if (err) return reject(err);
        if (res.statusCode === 200) return resolve();

        reject(new Error(
          'Failed to create Index:' + res.statusCode + ' ' + res.statusMessage
        ));
      });
    });
  });
}

function createType(config) {
  return new Promise(function (resolve, reject) {
    var typeUrl = config.elasticsearchUrl + '/' +
      config.elasticsearchIndex +
      '/_mapping/' +
      config.elasticsearchType;

    request({
      url: typeUrl,
      method: 'HEAD'
    }, function (err, res, body) {
      if (err) return reject(err);
      if (res.statusCode === 200) return resolve();

      request({
        url: typeUrl,
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            name: {
              type: 'text'
            },
            value: {
              type: 'double'
            },
            timestamp: {
              type: 'date'
            },
            type: {
              type: 'keyword'
            }
          }
        })
      }, function (err, res, body) {
        if (err) return reject(err);
        if (res.statusCode === 200) return resolve();

        reject(new Error(
          'Failed to create Type:' + res.statusCode + ' ' + res.statusMessage
        ));
      });
    });


  });
}
