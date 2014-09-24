FROM ubuntu:14.04

RUN apt-get clean && apt-get update
RUN apt-get install -y wget python-software-properties software-properties-common curl man vim aptitude telnet git unzip slapd tmux
RUN apt-get install -y nginx

RUN apt-get update

ADD . /root/snap-scrip
RUN mv /root/snap-scrip/nginx.conf /etc/nginx/nginx.conf

ENV version 1.0

# launch ssh
RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:welcome' |chpasswd

EXPOSE 22

# supervisor configuration
ADD docker/policy-rc.d /usr/sbin/policy-rc.d
ADD docker/sshd_config /etc/ssh/sshd_config
RUN apt-get install -y supervisor
RUN mkdir -p /var/log/supervisor
ADD docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD env | grep _ >> /etc/environment && /usr/bin/supervisord
