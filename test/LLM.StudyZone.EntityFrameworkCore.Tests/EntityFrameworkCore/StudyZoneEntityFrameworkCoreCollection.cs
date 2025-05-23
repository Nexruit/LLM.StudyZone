using Xunit;

namespace LLM.StudyZone.EntityFrameworkCore;

[CollectionDefinition(StudyZoneTestConsts.CollectionDefinitionName)]
public class StudyZoneEntityFrameworkCoreCollection : ICollectionFixture<StudyZoneEntityFrameworkCoreFixture>
{

}
