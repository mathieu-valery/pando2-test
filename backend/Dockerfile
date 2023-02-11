FROM ruby:2.7.0

# RUN apt-get update -qq && apt-get install -y nodejs postgresql-client
# RUN gem install bundler
WORKDIR /backend
COPY . /backend
# COPY Gemfile /Gemfile
# COPY Gemfile.lock /Gemfile.lock
COPY /bin/entry.sh ./backend/bin/entry.sh
RUN chmod +x ./backend/bin/entry.sh
# RUN chmod 755 ./backend/bin/entry.sh
RUN bundle install

EXPOSE 3000
ENTRYPOINT ["/bin/sh","./backend/bin/entry.sh"]
CMD rm -f tmp/pids/server.pid && rails s -b '0.0.0.0'