using LLM.StudyZone.Localization;
using Volo.Abp.Application.Services;

namespace LLM.StudyZone;

/* Inherit your application services from this class.
 */
public abstract class StudyZoneAppService : ApplicationService
{
    protected StudyZoneAppService()
    {
        LocalizationResource = typeof(StudyZoneResource);
    }
}
