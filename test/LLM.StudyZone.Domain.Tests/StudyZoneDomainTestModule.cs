using Volo.Abp.Modularity;

namespace LLM.StudyZone;

[DependsOn(
    typeof(StudyZoneDomainModule),
    typeof(StudyZoneTestBaseModule)
)]
public class StudyZoneDomainTestModule : AbpModule
{

}
