using LLM.StudyZone.Samples;
using Xunit;

namespace LLM.StudyZone.EntityFrameworkCore.Domains;

[Collection(StudyZoneTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<StudyZoneEntityFrameworkCoreTestModule>
{

}
