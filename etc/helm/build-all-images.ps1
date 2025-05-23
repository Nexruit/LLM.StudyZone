./build-image.ps1 -ProjectPath "../../src/LLM.StudyZone.DbMigrator/LLM.StudyZone.DbMigrator.csproj" -ImageName studyzone/dbmigrator
./build-image.ps1 -ProjectPath "../../src/LLM.StudyZone.Web.Public/LLM.StudyZone.Web.Public.csproj" -ImageName studyzone/webpublic
./build-image.ps1 -ProjectPath "../../src/LLM.StudyZone.HttpApi.Host/LLM.StudyZone.HttpApi.Host.csproj" -ImageName studyzone/httpapihost
./build-image.ps1 -ProjectPath "../../angular" -ImageName studyzone/angular -ProjectType "angular"
./build-image.ps1 -ProjectPath "../../src/LLM.StudyZone.AuthServer/LLM.StudyZone.AuthServer.csproj" -ImageName studyzone/authserver
