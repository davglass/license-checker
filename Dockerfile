FROM ubuntu:trusty

RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

RUN apt-get update && apt-get install -y curl git-core build-essential wget unzip
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && apt-get -y install nodejs

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app
ENV PATH /opt/app/bin:$PATH
