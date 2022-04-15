# Replication Steps

**NOTE: Last replicated on 4/14/2022**

- `git clone https://github.com/AnimeThemes/animethemes-db-dump`
- `docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_USER=root -e MYSQL_DATABASE=root -e MYSQL_ROOT_HOST=172.17.0.1 -p 3306:3306 -d mysql/mysql-server`
- `docker exec -i some-mysql mysql -uroot -proot root < animethemes-db-dump-create-tables.sql`
- `sed -e "s/^INSERT INTO/INSERT IGNORE INTO/" < animethemes-db-dump.sql | docker exec -i some-mysql mysql -uroot -proot root`