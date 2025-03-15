
<img src="https://img.shields.io/github/forks/clone2020/gke-js-manual">
<img src="https://img.shields.io/github/license/clone2020/gke-js-manual">
<img src="https://img.shields.io/github/stars/clone2020/gke-js-manual">

# Deploy an Application to GKE(Google Kubernetes Engine) 
### Tech used:
- Node.js
- Docker
- Kubernetes
- GKE(Google Kubernetes Engine)
- GAR(Google Artifact Registry)

<p>
<img src="https://github.com/clone2020/Images/blob/main/docker_image.gif?raw=true" height="36" width="36" >
<img src="https://github.com/clone2020/Images/blob/main/kubernetes.svg.png?raw=true"  height="36" width="36" >
<img src="https://github.com/clone2020/Images/blob/main/google-cloud.png?raw=true" height="36" >
</p>

- [x] Create a kubernetes cluster on GKE
- [x] Create Dir named nodeapp and run "$ npm init -y" -> should create a file called "package.json"
- [x] Setup Connection to create GKE cluster with your local machine or cloud shell.
- [x] Install "kubectl and gke-gcloud-auth-plugin"
```sh
$ gcloud components install kubectl
```
- [x] Connect to your cluster via command-line.
```sh
$ gcloud container clusters get-credentials <Cluster_Name> --zone <ZONE> --project <PROJECT_ID>
$ gcloud container clusters get-credentials autopilot-cluster-1 --region us-central1 --project even-impulse-453102-f1
```

- [x] Create a simple nodejs/express application.
```sh
    Install express app "$ npm i express"
    Create new file called app.js
    Run node js app. "/nodeapp$ node app.js" it should provide output as "Server is running on port 3000"
```
- [x] Write Dockerfile for the application.
```Dockerfile
   # User node base image
   FROM node:14.17.0-alpine3.13

   # Set the working directory
   WORKDIR /usr/app/

   # Copy the package.json file
   COPY package.json .

   # Install the dependencies
   RUN npm install

   # Copy the rest of the files
   COPY . .

   # Expose the port
   EXPOSE 3000

   # Run the app when the container starts by defining the entrypoint
   ENTRYPOINT ["node", "app.js"]

   # Optional: Define the CMD to provide default arguments.
   CMD ["--port", "3000"]
```
    Add the .Dockerignore file
- [x] Build the Docker image.
    If it is Googl container registry use the below.  // Google container registry is depricated.
```
    docker build -t us.gcr.io/<PROJECT_ID>/imagename:tag .
```
**If it is Artifact registry then follow the below.** // https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling
```
    $ docker build -t us-east1-docker.pkg.dev/even-impulse-453102-f1/dockerimage-repo/nodeapp:v1 .
```
- [x] <a href="https://cloud.google.com/sdk/docs/install#linux">Install gcloud into your local machine</a>


- [x] **Authenticate to GCR**
```sh
    $ gcloud auth --help
    $ gcloud auth configure-docker us-east1-docker.pkg.dev
```
- [x] Push Docker image to google artifact registry.
```sh
    $ docker image ls
    $ docker push us-east1-docker.pkg.dev/even-impulse-453102-f1/dockerimage-repo/nodeapp:v1    
```
---   
### Note:- If you get the below error.
```
       denied: Unauthenticated request. Unauthenticated requests do not have permission "artifactregistry.repositories.uploadArtifacts" on resource "projects/PROJECT_ID/locations/us-east1/repositories/image-repo" (or it may not exist)
```
**Try Using the below.**
```sh
    $ gcloud auth login
    $ gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://us-east1-docker.pkg.dev

 -> If you are using WSL or docker binary with sudo then try the below and then do the docker push in a new session.

    $ sudo usermod -aG docker $USER
```
---
- [x] Test the application using docker.
```sh
   $ docker run -d -p 3000:3000 "Docker_image_id"

   For debugging try the below.
   $ docker logs "container_id"
   $ docker run -it --entrypoint /bin/sh "docker_image_id"
```
### Make a new Dir named k8s.
- [x] Write kubernetes manifest file for deployment under k8s.
**deploy.yml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodeapp
  labels:
    app: nodeapp
    type: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nodeapp
  template:
    metadata:
      labels:
        app: nodeapp
        type: backend
    spec:
      containers:
      - name: nodeapp
        image: us-east1-docker.pkg.dev/even-impulse-453102-f1/dockerimage-repo/nodeapp:v1
        ports:
        - containerPort: 3000
```
- [x] Write kubernetes manifest file for service under k8s. **service.yml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nodeapp-load-service
spec:
  selector:
    app: nodeapp
    type: backend
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: LoadBalancer
```
- [x] Apply manifest file to create deployment.
```sh
$ kubectl apply -f deploy.yml
$ kubectl get deploy
```
- [x] Apply manifest file to craete service.
```sh
$ kubectl apply -f service.yml
$ kubectl get svc
```
- [x] Now test the deployment by retreving external IP from service you created with port number on your browser.
---
- [x] To clean up the cluster.
```sh
$ kubectl delete service nodeapp-load-service
$ kubectl delete deployment nodeapp
```
- [x] Delete the cluster.

   




