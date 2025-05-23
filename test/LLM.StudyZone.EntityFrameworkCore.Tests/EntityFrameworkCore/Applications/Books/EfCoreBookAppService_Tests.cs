using LLM.StudyZone.Books;
using Xunit;

namespace LLM.StudyZone.EntityFrameworkCore.Applications.Books;

[Collection(StudyZoneTestConsts.CollectionDefinitionName)]
public class EfCoreBookAppService_Tests : BookAppService_Tests<StudyZoneEntityFrameworkCoreTestModule>
{

}