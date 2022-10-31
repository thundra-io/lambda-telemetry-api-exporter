// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const fetch = require('node-fetch');
const fh = require('@aws-sdk/client-firehose');

const deliveryStreamName = process.env.DELIVERY_STREAM_NAME;
const dispatchMinBatchSize = parseInt(process.env.DISPATCH_MIN_BATCH_SIZE || 1);

const fhClient = new fh.FirehoseClient();

async function dispatch(queue, force) {
    if (queue.length !== 0 && (force || queue.length >= dispatchMinBatchSize)) {
        console.log('[telementry-dispatcher:dispatch] Dispatching', queue.length, 'telemetry events');;
        const requestBody = JSON.stringify(queue).concat('\n');
        queue.splice(0);

        if (!deliveryStreamName) {
            console.log(`[telemetry-dispatcher:dispatch] ${requestBody}`)
            console.log('[telementry-dispatcher:dispatch] deliveryStreamName not found. Discarding log events from the queue');
            return;
        }

        const recordParams = {
            Record: {
                Data: Buffer.from(requestBody),
            },
            DeliveryStreamName: deliveryStreamName,
        };

        const putCommand = new fh.PutRecordCommand(recordParams);
        await fhClient.send(putCommand);
    }
}

module.exports = {
    dispatch
}
