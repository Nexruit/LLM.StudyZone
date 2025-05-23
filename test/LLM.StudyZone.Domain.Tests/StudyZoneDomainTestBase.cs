using Volo.Abp.Modularity;

namespace LLM.StudyZone;

/* Inherit from this class for your domain layer tests. */
public abstract class StudyZoneDomainTestBase<TStartupModule> : StudyZoneTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
