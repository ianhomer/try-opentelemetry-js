# Try OpenTelemetry JS

    pnpm i

Start up a collector

    docker run \
      -p 127.0.0.1:4317:4317 \
      -p 127.0.0.1:55679:55679 \
      otel/opentelemetry-collector:latest \
      2>&1 | tee collector-output.txt

Start the express application

    pnpm start

And then hit API

    curl http://localhost:3000

and see tracing written to console or visit
<http://localhost:55679/debug/tracez> to see traces.
