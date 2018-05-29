FROM alpine

WORKDIR /sizeme

ADD https://github.com/SizeMeCom/sizeme.js/archive/v2.2.0.tar.gz /tmp
RUN tar zxvf /tmp/v2.2.0.tar.gz
RUN mv sizeme.js-2.2.0/lib 2.2
RUN rm -rf /tmp/v2.2.0.tar.gz sizeme.js-2.2.0

ADD https://github.com/SizeMeCom/sizeme.js/archive/master.zip /tmp
RUN unzip /tmp/master.zip
RUN mv sizeme.js-master/lib 2.3
RUN rm -rf /tmp/master.zip sizeme.js-master
