FROM postgres

# Copy the SQL files to the container
COPY database_setup.sql /docker-entrypoint-initdb.d/database_setup.sql
COPY fake-data.sql /docker-entrypoint-initdb.d/fake-data.sql
