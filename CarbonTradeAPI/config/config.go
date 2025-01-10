package config

type DBConfig struct {
	User     string `config:"user"` // 指定配置文件中的键
	Password string `config:"password"`
	Host     string `config:"host"`
	Database string `config:"database"`
	Port     string `config:"port"`
}

func GetMysqlConfig() DBConfig {
	return DBConfig{
		User:     "",
		Password: "",
		Host:     "",
		Database: "",
		Port:     "",
	}
}
