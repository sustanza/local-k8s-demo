load('ext://nerdctl', 'nerdctl_build')

print("""
-----------------------------------------------------------------
✨ Howdy y'all! 🤠
-----------------------------------------------------------------
""".strip())

# Build web app image
nerdctl_build(
    'webapp-image',
    dockerfile='./apps/web/Dockerfile',
    context='.',
    ignore=['./k8s', './apps/worker'],
    build_args={'node_env': 'development'},
        entrypoint='yarn turbo run dev --filter web',
        live_update=[
            sync('.', '/app')
        ]
)

# Build worker image
nerdctl_build(
    'worker-image',
    dockerfile='./apps/worker/Dockerfile',
    context='.',
    ignore=['./apps/web', './k8s'],
    build_args={'node_env': 'development'},
    entrypoint='yarn turbo run dev --filter worker',
    live_update=[
        sync('.', '/app')
    ]
)

# Define our k8s resources

## Adds the web app resource
k8s_resource(
    'webapp',
    port_forwards=[3000, 9229],
    resource_deps=['db', 'queue'],
    labels=["apps"]
)

## Adds the dotenv secrets resource
k8s_resource(
    new_name='dotenv',
    labels=["secrets"],
    objects=['dotenv:secret']
)

## Database
k8s_resource(
    new_name='db',
    port_forwards=[5432],
    objects=['db:Kubegres:default'],
    resource_deps=['dotenv'],
    labels=["infra"]
)

## Queue
k8s_resource(
    new_name='queue',
    port_forwards=[15672, 5672],
    objects=['queue:rabbitmqcluster:default'],
    resource_deps=['dotenv'],
    labels=["infra"]
)

## Worker
k8s_resource(
    'worker-ping',
    labels=['worker'],
    resource_deps=['db', 'queue']
)

## Worker Ping Scaler
k8s_resource(
    new_name='worker-ping-scaler',
    objects=['worker-ping-scaler:ScaledObject:default'],
    labels=['keda-scaler']
)

# Define kustomize resources
secrets_yaml = kustomize('./k8s/secrets/')

# Define our k8s configurations

## Add our web app configuration
k8s_yaml('./k8s/apps/webapp-deployment.yml')

## Worker: worker-ping
k8s_yaml('./k8s/apps/worker-ping-deployment.yml')

## Add in our secrets from kustomize configuration
k8s_yaml(secrets_yaml)

## Database configuration
k8s_yaml('./k8s/database/deployment.yml')

## Queue
k8s_yaml('./k8s/queue/deployment.yml')

## Scaler: worker-ping-scaler configuration
k8s_yaml('./k8s/scalers/worker-ping-scaler.yml')