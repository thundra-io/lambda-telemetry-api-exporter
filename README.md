![Latest Layer Version](https://api.globadge.com/v1/badgen/aws/lambda/layer/latest-version/us-east-1/269863060030/lambda-telemetry-api-exporter)

# lambda-telemetry-api-exporter

This layer will be used to export generated telemetry data to various sources. At the moment, it only supports to export to a **Kinesis Delivery Stream**, ie. **Kinesis Firehose**.

### Usage

Layer is runtime agnostic and includes a node binary in itself, so that it can be used in any runtime without any issue.

```
arn:aws:lambda:{region}:269863060030:layer:lambda-telemetry-api-exporter:{version}
```

Replace the `{region}` with your region and `{version}` with the latest version of this layer. The latest version for this layer can be found here in this badge:

![Latest Layer Version](https://api.globadge.com/v1/badgen/aws/lambda/layer/latest-version/us-east-1/269863060030/lambda-telemetry-api-exporter)

After adding the layer to your lambda, simply set your **Delivery Stream** name to the environment variable `DELIVERY_STREAM_NAME`. This will export the telemetry events to your delivery stream and the rest is up to you.
