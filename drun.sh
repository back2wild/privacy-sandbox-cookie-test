docker rm -f privacy-sandbox-cookie-test
docker run -d \
--name privacy-sandbox-cookie-test \
--publish 9004:8080 \
privacy-sandbox-cookie-test
