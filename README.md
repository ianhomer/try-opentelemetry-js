# Try OpenTelemetry JS

    pnpm i

Start up a collector that dumps the trace exports to a console, so that you can
see what is being sent in the export API calls.

    pnpm start-collector

Start the express application

    pnpm start

And then hit API to generate some trace signals

    curl http://localhost:3000

## Capturing traces

Start up the opentelemetry-collector to capture traces in a lightweight stack

    docker run \
      -p 127.0.0.1:4318:4318 \
      -p 127.0.0.1:55679:55679 \
      otel/opentelemetry-collector:latest \
      2>&1 | tee collector-output.txt

and see tracing written to console or visit
<http://localhost:55679/debug/tracez> to see traces.
