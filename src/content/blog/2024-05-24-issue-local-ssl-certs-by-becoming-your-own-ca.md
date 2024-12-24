---
title: Issue local SSL Certificates by becoming your own Certificate Authority
image: 2024-01-05-title.png
timetoreadmins: 5
slug: local-ssl-certs-diy-ca
date: 24.05.2024
tags: 
  - ssl
  - certificate
  - certificate-authority
  - security
---

1. Generate a private key for the CA root certificate (with symetric aes256 encryption) and store the passphrase in keypass, along with the ca-key.pem as a file attachment.

2. Generate a public CA Cert, signed with the private key we just created

__The code:__

```bash
# CA Cert
openssl genrsa -aes256 -out ca-private-key.pem 4096
openssl req -new -x509 -sha256 -days 3650 -key ca-private-key.pem -out ca.pem

# Site Certs
openssl genrsa -out site1-key.pem 4096
openssl req -new -sha256 -subj "/CN=site1.de" -key site1-key.pem -out site1.csr
echo "subjectAltName=DNS:site1.de,IP:127.0.0.1" > extfile.cnf

openssl x509 -req -days 1095 -in site1.csr -CA ca.pem -CAkey ca-private-key.pem -out site1.pem -extfile extfile.cnf -CAcreateserial

cat site1.pem > site1-fullchain.pem
cat ca.pem >> site1-fullchain.pem
```

https://pfsense.home.arpa/

openssl genrsa -out pfsense-key.pem 4096
openssl req -new -sha256 -subj "/CN=pfsense.home.arpa" -key pfsense-key.pem -out pfsense.csr
echo "subjectAltName=DNS:pfsense.home.arpa,IP:192.168.1.1" > extfile.cnf

openssl x509 -req -days 1095 -in pfsense.csr -CA ca.pem -CAkey ca-private-key.pem -out pfsense.pem -extfile extfile.cnf -CAcreateserial

cat pfsense.pem > pfsense-fullchain.pem
cat ca.pem >> pfsense-fullchain.pem