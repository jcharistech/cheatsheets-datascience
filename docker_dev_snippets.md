#### How to Run A Docker Container
+ docker run -t -d --name first_app python

#### How to Get Container IP Address
+ sudo docker inspect CONTAINER_ID | grep IPAddress

For Windows
+ docker inspect <container id> | findstr "IPAddress"

#### How to Check for ports on linux

```bash
apt install lsof
sudo lsof -i -P -n | grep LISTEN
sudo netstat -tulpn | grep LISTEN
sudo ss -tulpn | grep LISTEN
sudo lsof -i:22 ## see a specific port such as 22 ##
sudo nmap -sTU -O IP-address-Here
```

### How to check Connection Between Containers 
Default network that all containers share is called bridge

```bash
docker network ls

```

#### How to check if a container is in the bridge network
This will show you all the containers that are connected to that brdidge

```bash
docker network inspect bridge
```

#### How Containers Communicate with each other 
In order to allow containers to communicate with each other you can use the
default bridge network and then check 
the IP Address of each container and access them accordingly. 

+ docker network inspect container_id | grep address


#### Using User Defined Network For Containers to Communicate with each other
+ Create a custom network
```bash
docker network create myown-net
```
Start a container and connect it to that network
```bash
docker run --net myown-net --name container_name -d imagename
```
Start another container and connect it to that network
```bash
docker run --net myown-net  -it imagename bin/bash
```
To access or connect to the other network you can use the name of the container.
This serves as the hostname
eg  if container --name is ´mycontainer´
```bash
wget -q -O - mycontainer:80
```

#### How to Connect An Existing Container to a Network
```bash
docker network connect myown-net container_name
```

##### FastAPI Dockerfile

+ docker run -d -p 8000:80 fastapi:latest
+ docker run -p 8000:8000 -t -i fastapi

```bash
FROM python:3.10

WORKDIR /app

COPY requirements.txt ./requirements.txt

RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 8000:8000

COPY . /app

CMD uvicorn app:app --host 0.0.0.0 --port 8000 --reload
#CMD python app.py
# the --port(8000) must match with the EXPOSE port above(8000)

```

##### Streamlit Dockerfile

+ docker run -d -p 8080:8080 app:latest

```bash
FROM python:3.10

WORKDIR /app

COPY requirements.txt ./requirements.txt


RUN pip3 install -r requirements.txt

EXPOSE 8080

COPY . /app


CMD streamlit run --server.port 8080 --server.enableCORS false app.py
```

docker ps --format=$FORMAT



#### How to SSH Into Docker

Method 1: using exec --it

```bash
sudo docker pull nginx
sudo docker run --name mycontainername -d imagename
sudo docker exec -it nginx-test /bin/bash
```


Method 2: Using Attach
```bash
sudo docker start container_name
sudo docker attach container_name
```


Method 3: Using SSH
Install ssh on local system
```bash
sudo apt-get install ssh
sudo systemctl ssh start
sudo systemctl ssh enable
service ssh status

```

Remote docker
```bash
sudo docker inspect -f "{{ .NetworkSettings.IPAddress }}" container_name
ssh root@172.17.0.2

```

##### Instruction for Dockerfile to create a new image on top of the base image (ubuntu)

```bash
FROM ubuntu:16.04

RUN apt-get update && apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:mypassword' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
```

#### How to Build An Image From Dockerfile

```bash
docker build -t myimage .

#outside:inside_container_port
docker run -d -p 8080:80 myimage --name mycontainer_name
```

#### How to Stop All Containers
```bash
docker stop $(docker ps -a -q)
```

```bash
#### How to Remove All Containers
docker rm $(docker ps -a -q)
```

#### How to copy files from local to docker
```bash
sudo docker cp myfile.txt container_id:/home/
sudo docker cp dev_id_rsa.pub 2b4dacc14b52:/home/
```

#### How to copy files from docker container to local system
```bash
docker cp container_id:source_path host_destination_path
docker cp 2b4dacc14b52:/home/myfile  /home/
```

#### Mounting Container and Host
{host} docker run -v /path/to/hostdir:/mnt --name my_container my_image
{host} docker exec -it my_container bash
{container} cp /mnt/sourcefile /path/to/destfile


### Working with Docker Container Volumes
* Create a volume:
```bash
docker volume create my-vol
```
* List volumes:
```bash
docker volume ls
```
* Inspect a volume:
```bash
docker volume inspect my-vol
```

##### Starting a Container with A Volume
```bash
docker run -d \
  --name devtest \
  -v myvol2:/app \
  nginx:latest
```

docker run -d \
  --name firstapp \
  -v my-vol:/app \
  python:latest



#### How to mount a host directory in a Docker container
* Create the directory on your local system 
* Start up your container from an image as below

```bash
docker run -t -i -v <host_dir>:<container_dir>  ubuntu /bin/bash
docker run -it -d --name first_app -v $(pwd):/home imagename /bin/bash	
```

```bash
$ docker run --name mysql-db -v $(pwd)/datadir:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:8.0.28-debian
```








#### Adding Volume to An Existing Container
```bash
docker ps
docker commit container_id imagename
```

## SSH 

### Creating SSH Keys using ssh-keygen
ssh-keygen -t rsa 




#### Working with PuTTY’s Public Key Format
+ The format PuTTYGen uses when it saves the public key is incompatible with the OpenSSH authorized_keys files used for SSH key authentication on Linux servers.
+ If you need to see the public key in the right format after the private key has been saved:

+ Open PuTTYgen.
+ Next to Load an existing private key file, click the Load button.
+ Navigate to the private key in your file system and select it.
+ Click Open.


#### What goes to the server
```bash
cd ~
mkdir .ssh
cat authorized_keys
cat id_rsa.pub >> .ssh/authorized_keys 
```
or
```bash
cat /home/dev_id_rsa.pub >> ~/.ssh/authorized_keys
```

```bash
cat ~/.ssh/id_rsa.pub | ssh root@192.168.1.29 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys
```
```bash
cat dev_id_rsa.pub | ssh root@2b4dacc14b52 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys
```


### How to Set SSH Keys Authorised Keys
mkdir .ssh/

changing the line in /etc/ssh/sshd_config
```bash
PermitRootLogin yes
```
to

```bash
PermitRootLogin no
```
To reload the configuration.
```bash
service sshd restart
```

#### Creating A User
Create new user with sudo

$ adduser your_username
$ id your_username
$ usermod -aG sudo your_username
$ id your_username


#### Docker Compose

```bash
docker-compose up --build 
```

```yaml
# docker-compose.yaml
services:
	app:
		build: . # use the dockerfile in the current directory
		container_name: mycontainername
		command: uvicorn main:app --host 0.0.0.0 --port 80 --reload
		ports:
			- 8080:80 # hostmachine_outside:inside container_port
		volumes:
			- .:/app # current folder/ folder inside container

```

#### How to use a different compose file name
```bash
docker-compose -f docker-compose.test.yml up
```

#### Sample Docker compose for FastAPI
```bash
version: "3"
services:
  app:
    build: .
    command: "streamlit run --server.port 8080 --server.enableCORS false app.py"
    ports:
      - "8501:8501"

```
#### Sample Dockercompose file for two services
```bash
version: "3"
services:
  api:
    container_name: myapi
    build: booksapi/.
    command: "uvicorn app:app --host 0.0.0.0 --port 8000 --reload"
    ports:
      - "8000:8000"
    networks: #user defined network bridge for all containers
      - jcnet

  app:
    container_name: myapp
    build: .
    command: "streamlit run --server.port 8080 --server.enableCORS false app.py"
    ports:
      - "8501:8501"
    networks:
      - jcnet
networks:
  jcnet

    

```
#### How to run docker-compose
```bash
docker-compose build 
docker-compose up 
docker-compose down
sudo docker-compose -f docker-compose-dev.yaml up
docker-compose build -d
```