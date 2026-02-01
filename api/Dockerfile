# Install application gems
COPY vendor/* ./vendor/
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle install

# Precompile bootsnap safely before cleaning
RUN bundle exec bootsnap precompile -j 1 --gemfile app/ lib/

# Clean up caches safely AFTER precompilation
RUN rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git || true
