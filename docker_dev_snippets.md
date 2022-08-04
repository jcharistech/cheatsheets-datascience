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
docker ps
docker commit container_id imagename


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


```bash


```bash