package common

import "time"

func ParseTime(t string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04:05", t)
}
