openssl genrsa -aes256 -out rsa-key.pem 2048
openssl rsa -in rsa-key.pem -outform PEM -out rsa-priv.pem
openssl rsa -in rsa-key.pem -outform PEM -pubout -out rsa-pub.pem
