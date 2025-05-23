docker network create studyzone --label=studyzone
docker-compose -f docker-compose.infrastructure.yml up -d
exit $LASTEXITCODE