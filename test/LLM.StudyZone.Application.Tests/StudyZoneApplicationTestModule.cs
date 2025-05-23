using Volo.Abp.Modularity;

namespace LLM.StudyZone;

[DependsOn(
    typeof(StudyZoneApplicationModule),
    typeof(StudyZoneDomainTestModule)
)]
public class StudyZoneApplicationTestModule : AbpModule
{

}
