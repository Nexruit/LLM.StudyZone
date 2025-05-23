using Volo.Abp.Modularity;

namespace LLM.StudyZone;

public abstract class StudyZoneApplicationTestBase<TStartupModule> : StudyZoneTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
