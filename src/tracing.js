// tracing.js

"use strict";

const process = require("process");
const uuid = require("uuid");
const opentelemetry = require("@opentelemetry/sdk-node");
const {
    ConsoleSpanExporter,
    SimpleSpanProcessor,
} = require('@opentelemetry/sdk-trace-base');
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  WebTracerProvider,
  BatchSpanProcessor,
} = require("@opentelemetry/sdk-trace-web");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

// configure the SDK to export telemetry data to the console
// enable all auto-instrumentations from the meta package
//
//
const customHeaders = {
  foo: "foo-value",
};

const traceExporter = new OTLPTraceExporter({
  url: "http://127.0.0.1:4317/v1/traces",
  headers: customHeaders,
  concurrencyLimit: 10,
});

const OTEL_SERVICE_RESOURCE = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "otel-express-node",
  [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
  [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: uuid.v4(),
});

const provider = new WebTracerProvider({ resource: OTEL_SERVICE_RESOURCE });
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(
  new BatchSpanProcessor(traceExporter, {
    // The maximum queue size. After the size is reached spans are dropped.
    maxQueueSize: 1000,
    // The interval between two consecutive exports
    scheduledDelayMillis: 1000,
  }),
);
provider.register();

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "my-service",
  }),
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk
  .start()

// gracefully shut down the SDK on process exit
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
