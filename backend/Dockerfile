FROM ubuntu:jammy
ARG VIPS_VERSION=8.13.2
ARG VIPS_URL=https://github.com/libvips/libvips/releases/download

# basic build tools
RUN apt-get update && apt-get install -y build-essential autoconf automake libtool nasm unzip wget git pkg-config curl

RUN apt-get install -y libglib2.0-dev libexpat1-dev libpng-dev libjpeg-dev libgif-dev librsvg2-dev libwebp-dev libexif-dev liblcms2-dev libimagequant-dev && ldconfig

RUN cd /usr/local/src  && wget ${VIPS_URL}/v${VIPS_VERSION}/vips-${VIPS_VERSION}.tar.gz \
    && tar xzf vips-${VIPS_VERSION}.tar.gz

RUN cd /usr/local/src/vips-${VIPS_VERSION} && ./configure && make && make install && ldconfig

# nodejs and Yarn
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y nodejs yarn

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 8080
CMD [ "yarn", "dev" ]
