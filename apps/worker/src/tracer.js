import {diag, DiagConsoleLogger, DiagLogLevel} from "@opentelemetry/api";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-http";
import {BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor} from "@opentelemetry/sdk-trace-base";
import {Resource} from "@opentelemetry/resources";
import {SemanticResourceAttributes} from "@opentelemetry/semantic-conventions";


// Set the logger to verbose here so we can just have some details about what is going on at first
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

// create our OLTP exporter for Jaeger
const exporter = new OTLPTraceExporter({
    url: 'http://jaeger-collector:4318/v1/traces'
});

// setup a provider for the tracer
const provider = new BasicTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'worker',
    }),
});

// create a provider for the exporter
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// create a provider for the console exporter (so we can see the traces in the console)
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

// register the provider (turn it on)
provider.register();