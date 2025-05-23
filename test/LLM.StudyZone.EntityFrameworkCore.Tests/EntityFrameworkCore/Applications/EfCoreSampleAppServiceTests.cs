using LLM.StudyZone.Samples;
using Xunit;

namespace LLM.StudyZone.EntityFrameworkCore.Applications;

[Collection(StudyZoneTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<StudyZoneEntityFrameworkCoreTestModule>
{

}
