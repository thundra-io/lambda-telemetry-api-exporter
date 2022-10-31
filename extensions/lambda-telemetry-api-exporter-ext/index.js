#!/usr/bin/env node
const extensionsApi = require('./api/extensions-api');
const telemetryApi = require('./api/telemetry-api');
const telemetryListener = require('./api/telemetry-listener');
const telemetryDispatcher = require('./api/telemetry-dispatcher');

(async function main() {
    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    console.log('[index:main] Starting the Telemetry API extension');

    // Step 1 - Register the extension with Extensions API
    console.log('[index:main] Registering extension');
    const extensionId = await extensionsApi.register();
    console.log('[index:main] Registered with extensionId', extensionId);

    // Step 2 - Start the local http listener which will receive data from Telemetry API
    console.log('[index:main] Starting the telemetry listener');
    const listenerUri = telemetryListener.start();
    console.log('[index:main] Telemetry listener started at', listenerUri);

    // Step 3 - Subscribe the listener to Telemetry API
    console.log('[index:main] Subscribing the telemetry listener to Telemetry API');
    await telemetryApi.subscribe(extensionId, listenerUri);
    console.log('[index:main] Subscription success');

    while (true) {
        console.log('[index:main] Next');

        // This is a blocking action
        const event = await extensionsApi.next(extensionId);

        switch (event.eventType) {
            case 'INVOKE':
                handleInvoke(event);
                await telemetryDispatcher.dispatch(telemetryListener.eventsQueue, false);
                break;
            case 'SHUTDOWN':
                // Wait for 1 sec to receive remaining events
                await new Promise((resolve, reject) => { setTimeout(resolve, 1000) });

                // Dispatch queued telemetry prior to handling the shutdown event
                await telemetryDispatcher.dispatch(telemetryListener.eventsQueue, true);
                handleShutdown(event);
                break;
            default:
                throw new Error('[index:main] unknown event: ' + event);
        }
    }
})();

function handleShutdown(event) {
    console.log('[index:handleShutdown]');
    process.exit(0);
}

function handleInvoke(event) {
    console.log('[index:handleInvoke]');
}
