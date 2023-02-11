#!/bin/bash
set -e

cd backend
rails db:migrate
rake extract:measurements
cd ..
exec "$@"