<!-- sequelize db:migrate -->
migrations ：迁移文件，迁移到数据库去，有allowNull等修改则去

<!-- sequelize model:generate --name Article --attributes title:string,content:text -->
models ：模型文件，生成对应的表

<!-- sequelize seed:generate --name article -->
seeders ：数据填充文件（种子文件），生成种子文件，用于一次性插入大量的数据